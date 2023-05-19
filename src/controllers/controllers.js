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
  const {email, password}= req.body

  const validation = loginSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

  try {
    // Verificar se esse e-mail já foi cadastrado
    const usuarioExiste = await db.query(`
    SELECT * FROM usuarios WHERE email = $1
  `, [email])

  if (usuarioExiste.rowCount <= 0) return res.sendStatus(401)

  // Verificar se a senha digitada corresponde com a criptografada
  const senhaEstaCorreta = bcrypt.compareSync(password, usuarios.password)
  if (!senhaEstaCorreta) return res.status(401).send("Senha incorreta")

  // Criar um token para enviar ao usuário
  const token = uuid()

  // Guardar o token e o id do usuário para saber que ele está logado
  await db.query(`INSERT INTO sessoes ("userId", token) VALUES ($1, $2)`, [usuarios.id, token])

  // Finalizar com status de sucesso e enviar token para o cliente
    res.status(200).send({"token": token});
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function inserirURL(req, res) {
  const { url } = req.body;
  const { id: userId } = req.params;

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

    // Caso a sessão tenha sido encontrada, iremos guardar na variável "sessao" o objeto de sessão encontrado
    const sessaoEncontrada = sessao.rows[0];

    // Tendo o id do usuário, podemos procurar seus dados
    const usuario = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [sessaoEncontrada.userId]);
    // Verifica se o usuário foi encontrado
    if (usuario.rows.length === 0) return res.status(401).send("Usuário não encontrado");

    const shortUrl = nanoid(10);

    const inserirShortUrl = await db.query(`INSERT INTO url ("shortUrl", url, "userId") VALUES ($1, $2, $3) RETURNING id`, [shortUrl, url, userId]);

    res.status(201).send({ "id": inserirShortUrl.rows[0].id, "shortUrl": shortUrl });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function listarURLporId(req, res) {
  const {id} = req.params

  try {
    const listaPorId = await db.query(`SELECT * FROM url WHERE id = $1;`, [id]);

    if (listaPorId.rowCount === 0) {return res.sendStatus(404);}

    res.status(200).send({"id": result.rows[0].id, "shortUrl": result.rows[0].shortUrl, "url": result.rows[0].url});
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function buscarShortURL(req, res) {
    const { shortUrl } = req.params;
    try {
     const urlExiste = await db.query(`SELECT * FROM url WHERE "shortUrl" = $1`, [shortUrl]);
      if (urlExiste.rowCount === 0) return res.sendStatus(404)

      await db.query(`UPDATE shortens SET "visitCount" = "visitCount" + 1 WHERE id = $1`, [urlExiste.rows[0].id])
      
      res.redirect(urlExiste.rows[0].url);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

export async function deletarURL(req, res) {
// //   const { name, phone, cpf, birthday } = req.body;
// //   const { id } = req.params;

// //   const validation = clientesSchema.validate(req.body, { abortEarly: false });

// //   if (validation.error) {
// //     const errors = validation.error.details.map((d) => d.message);
// //     return res.status(400).send(errors);
// //   }

// //   try {
// //     const cpfExiste = (
// //       await db.query("SELECT * FROM customers WHERE cpf=$1 AND id!=$2", [cpf, id]));
// //     if (cpfExiste.rowCount) return res.sendStatus(409);

// //     await db.query(`UPDATE customers SET "name"=$1, "phone"=$2, "cpf"=$3, "birthday"=$4 WHERE "id"=$5`,[name, phone, cpf, birthday, id]);
// //     res.sendStatus(200);
// //   } catch (err) {
// //     res.status(500).send(err.message);
// //   }
}

export async function listarUsuarioToken(req, res) {
// //   try {
//         // O cliente deve enviar um header de authorization com o token
//         const { authorization } = req.headers

//         // O formato é assim: Bearer TOKEN, então para pegar o token vamos tirar a palavra Bearer
//         const token = authorization?.replace("Bearer ", "")
    
//         // Se não houver token, não há autorização para continuar
//         if (!token) return res.status(401).send("Token inexistente")
    
//         try {
//             // Caso o token exista, precisamos descobrir se ele é válido
//             // Ou seja: se ele está na nossa collection de sessoes
//             const sessao = await db.query(`SELECT * FROM sessoes WHERE token = $1`, [token]).rows;
//             if (!sessao) return res.status(401).send("Token inválido")
    
//             // Caso a sessão tenha sido encontrada, irá guardar a variavel sessão duas coisas:
//             // O token e o id do usuário. Tendo o id do usuário, podemos procurar seus dados
//             const usuario = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [sessoes.userId]).rows;
//             if (!usuario) return res.status(401).send("Usuário não encontrado")
    
//         // O usuario possui _id, nome, email e senha. Mas não podemos enviar a senha!
//         delete usuario.senha

//         // Agora basta enviar a resposta ao cliente
//         res.send(usuario)

//     res.send(alugueis)
    
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function ranking(req, res) {
// //     const { customerId, gameId, daysRented } = req.body;

// //     const validation = alugueisSchema.validate(req.body, { abortEarly: false });
  
// //     if (validation.error) {
// //       const errors = validation.error.details.map((d) => d.message);
// //       return res.status(400).send(errors);
// //     }
  
// //     try {
// //         let returnDate = null;
// //         let delayFee = null;
// //         let rentDate = new Date().toISOString().slice(0, 10)
// //         if(daysRented <= 0) return res.sendStatus(400);
        
// //       const clienteExiste = await db.query("SELECT * FROM customers WHERE id = $1", [customerId]);
// //       if (clienteExiste.rows.length == 0) return res.sendStatus(400);

// //       const jogoExiste = await db.query("SELECT * FROM games WHERE id = $1", [gameId]);
// //       if (jogoExiste.rows.length == 0) return res.sendStatus(400);
    
// //       const originalPrice = daysRented * jogoExiste.rows[0].pricePerDay;


// //       const jogoDisponivel = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" is null;`, [gameId]);
// //       if (jogoDisponivel.rows.length >= jogoExiste.rows[0].stockTotal) return res.sendStatus(400);
  
// //       await db.query(
// //         `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
// //         [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
// //       );
// //       res.sendStatus(201);
// //     } catch (err) {
// //       res.status(500).send(err.message);
// //     } 
  }
