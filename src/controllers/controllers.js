import { db } from "../database/database.config.js";
import {cadastroSchema, loginSchema, urlSchema} from "../schemas/schemas.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { nanoid } from 'nanoid'



export async function cadastro(req, res) {
  const {email, name, password, confirmPassword}= req.body

  //validacao do schema
  const validation = cadastroSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

  // verificar se as senhas coincidem
  // if (password !== confirmPassword) {
  //   return res.sendStatus(400);
  // }

  try{
     // Verificar se esse e-mail já foi cadastrado
    const usuarioExiste = await db.query(`
      SELECT * FROM usuarios WHERE email = $1
    `, [email])

    if (usuarioExiste.rowCount > 0) return res.sendStatus(409)

     // Criptografar senha
     const hash = bcrypt.hashSync(password, 10)

     // Criar conta e guardar senha encriptada no banco
    await db.query(
            `INSERT INTO usuarios (email, name, password) VALUES ($1, $2, $3)`,
            [email, name, hash]
          );

  return res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function login(req, res) {
  const {email, password} = req.body

  const validation = loginSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

  try {
  // Verificar se esse e-mail já foi cadastrado
  const usuarioExiste = await db.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
  if (usuarioExiste.rowCount === 0) return res.sendStatus(401)

  // Verificar se a senha digitada corresponde com a criptografada
  const senhaEstaCorreta = bcrypt.compareSync(password, usuarioExiste.rows[0].password)
  if (!senhaEstaCorreta) return res.status(401).send("Senha incorreta")

  // Criar um token para enviar ao usuário
  const token = uuid()

  // Guardar o token e o id do usuário para saber que ele está logado
  await db.query(`INSERT INTO sessoes (token, "userId") VALUES ($1, $2)`, [token, usuarioExiste.rows[0].id])

  // Finalizar com status de sucesso e enviar token para o cliente
    return res.status(200).send({"token": token});
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function inserirURL(req, res) {
  const { url } = req.body;

  const validation = urlSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

  // O cliente deve enviar um header de authorization com o token
  const { authorization } = req.headers;

  // O formato é assim: Bearer TOKEN, então para pegar o token vamos tirar a palavra Bearer
  const token = authorization?.replace("Bearer ", "");

  // Se não houver token, não há autorização para continuar
  if (!token) return res.status(401).send("Token inexistente");

  try {
    // Caso o token exista, precisamos descobrir se ele é válido
    // Ou seja: se ele está na nossa collection de sessoes
    const sessao = await db.query(`SELECT * FROM sessoes WHERE token = $1`, [token]);
    // Verifica se há alguma sessão encontrada
    if (sessao.rows.length === 0) return res.status(401).send("Token inválido");

    console.log("sessoes " ,sessao)
    // Caso a sessão tenha sido encontrada, iremos guardar na variável "sessao" o objeto de sessão encontrado
    const sessaoEncontrada = sessao.rows[0];
    console.log("sessao en " ,sessaoEncontrada)

    // Tendo o id do usuário, podemos procurar seus dados
    const usuario = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [sessaoEncontrada.userId]);
    // Verifica se o usuário foi encontrado
    if (usuario.rows.length === 0) return res.status(401).send("Usuário não encontrado");

    const shortUrl = nanoid(10);

    const inserirShortUrl = await db.query(`INSERT INTO url ("shortUrl", url, "userId") VALUES ($1, $2, $3) RETURNING id`, [shortUrl, url, sessaoEncontrada.userId]);

    return res.status(201).send({ "id": inserirShortUrl.rows[0].id, "shortUrl": shortUrl });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function listarURLporId(req, res) {
  const {id} = req.params

  try {
    const listaPorId = await db.query(`SELECT * FROM url WHERE id = $1;`, [id]);

    if (listaPorId.rowCount === 0) {return res.sendStatus(404);}

    return res.status(200).send({"id": result.rows[0].id, "shortUrl": result.rows[0].shortUrl, "url": result.rows[0].url});
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function buscarShortURL(req, res) {
    const { shortUrl } = req.params;
    try {
     const urlExiste = await db.query(`SELECT * FROM url WHERE "shortUrl" = $1`, [shortUrl]);
      if (urlExiste.rowCount === 0) return res.sendStatus(404)

      await db.query(`UPDATE url SET "visitCount" = "visitCount" + 1 WHERE id = $1`, [urlExiste.rows[0].id])
      
      return res.redirect(urlExiste.rows[0].url);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

export async function deletarURL(req, res) {
  const {id} = req.params

  // O cliente deve enviar um header de authorization com o token
  const { authorization } = req.headers;

  // O formato é assim: Bearer TOKEN, então para pegar o token vamos tirar a palavra Bearer
  const token = authorization?.replace("Bearer ", "");

  // Se não houver token, não há autorização para continuar
  if (!token) return res.status(401).send("Token inexistente");

  try {
    // Caso o token exista, precisamos descobrir se ele é válido
    // Ou seja: se ele está na nossa collection de sessoes
    const sessao = await db.query(`SELECT * FROM sessoes WHERE token = $1`, [token]);
    // Verifica se há alguma sessão encontrada
    if (sessao.rows.length === 0) return res.status(401).send("Token inválido");

    // Caso a sessão tenha sido encontrada, iremos guardar na variável "sessao" o objeto de sessão encontrado
    const sessaoEncontrada = sessao.rows[0];

    // Tendo o id do usuário, podemos procurar seus dados
    const usuario = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [sessaoEncontrada.userId]);
    // Verifica se o usuário foi encontrado
    if (usuario.rows.length === 0) return res.status(401).send("Usuário não encontrado");

    const urlUsuario = await db.query(`SELECT * FROM url WHERE id = $1`, [id])
    if (urlUsuario.rowCount === 0) return res.sendStatus(404)

    if (urlUsuario.rows[0].userId !== usuario.rows[0].id) return res.sendStatus(401)

    await db.query(`DELETE FROM url WHERE id = $1`, [id])

    return res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function listarUsuarioToken(req, res) {
  // O cliente deve enviar um header de authorization com o token
  const { authorization } = req.headers;

  // O formato é assim: Bearer TOKEN, então para pegar o token vamos tirar a palavra Bearer
  const token = authorization?.replace("Bearer ", "");

  // Se não houver token, não há autorização para continuar
  if (!token) return res.status(401).send("Token inexistente");

  try {
    // Caso o token exista, precisamos descobrir se ele é válido
    // Ou seja: se ele está na nossa collection de sessoes
    const sessao = await db.query(`SELECT * FROM sessoes WHERE token = $1`, [token]);
    // Verifica se há alguma sessão encontrada
    if (sessao.rows.length === 0) return res.status(401).send("Token inválido");

    // Caso a sessão tenha sido encontrada, iremos guardar na variável "sessao" o objeto de sessão encontrado
    const sessaoEncontrada = sessao.rows[0];

    // Tendo o id do usuário, podemos procurar seus dados
    const usuario = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [sessaoEncontrada.userId]);
    // Verifica se o usuário foi encontrado
    if (usuario.rows.length === 0) return res.status(401).send("Usuário não encontrado");
    
    const visitas = await db.query(`SELECT SUM(url."visitCount") FROM url WHERE "userId" = $1`, [usuario.rows[0].id])

    const urls = await db.query(`SELECT * FROM url WHERE "userId" = $1`, [usuario.rows[0].id])

    const shortenedUrls = urls.rows.map((i) => {
      return {
        id: i.id,
        shortUrl: i.shortUrl,
        url: i.url,
        visitCount: i.visitCount
      }
    })

    res.status(200).send({
      id: usuario.rows[0].id,
      name: usuario.rows[0].name,
      visitCount: visitas.rows[0].sum || 0,
      shortenedUrls
    })

  } catch (err) {
    res.status(500).send(err.message);
  }
}


export async function ranking(req, res) {
try{
  
  res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err.message);
    } 
  }

  
