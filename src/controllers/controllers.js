import { db } from "../database/database.config.js";
import {cadastroSchema, loginSchema, urlSchema} from "../schemas/schemas.js";



export async function cadastro(req, res) {

  const validation = cadastroSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function login(req, res) {
  const validation = loginSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

//   try {
//     const jogos = await db.query("SELECT * FROM games");
//     res.send(jogos.rows);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function inserirURL(req, res) {
//   const { name, phone, cpf, birthday } = req.body;

const validation = urlSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

//   try {
//     const cpfExiste = (
//       await db.query("SELECT * FROM customers WHERE cpf = $1", [cpf])
//     ).rows;
//     if (cpfExiste.length !== 0) return res.sendStatus(409);

//     await db.query(
//       `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
//       [name, phone, cpf, birthday]
//     );
//     res.sendStatus(201);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function listarURLporId(req, res) {
//   try {
//     const clientes = await db.query("SELECT * FROM customers");
//     const aniversario = clientes.rows.map(item => ({...item,  birthday: new Date(item.birthday).toISOString().split('T')[0]  }))
//     res.send(aniversario);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function buscarShortURL(req, res) {
//     const { id } = req.params;
//     try {
//       const clientes = await db.query("SELECT * FROM customers WHERE id = $1", [id]);
//       if (!clientes.rows.length) return res.sendStatus(404);
//       const response = clientes.rows[0];
  
//       const birthday = new Date(response.birthday);
//       // Formatting date
//       let day = birthday.getUTCDate();
//       day = day.toString().length == 1 ? '0' + day : day;
//       let month = birthday.getUTCMonth() + 1;
//       month = month.toString().length == 1 ? '0' + month : month;
//       const year = birthday.getUTCFullYear();
  
//       // Replace original date for formatted date
//       response.birthday = `${year}-${month}-${day}`
//       res.send(response);
//     } catch (err) {
//       res.status(500).send(err.message);
//     }
  }

export async function deletarURL(req, res) {
//   const { name, phone, cpf, birthday } = req.body;
//   const { id } = req.params;

//   const validation = clientesSchema.validate(req.body, { abortEarly: false });

//   if (validation.error) {
//     const errors = validation.error.details.map((d) => d.message);
//     return res.status(400).send(errors);
//   }

//   try {
//     const cpfExiste = (
//       await db.query("SELECT * FROM customers WHERE cpf=$1 AND id!=$2", [cpf, id]));
//     if (cpfExiste.rowCount) return res.sendStatus(409);

//     await db.query(`UPDATE customers SET "name"=$1, "phone"=$2, "cpf"=$3, "birthday"=$4 WHERE "id"=$5`,[name, phone, cpf, birthday, id]);
//     res.sendStatus(200);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function listarUsuarioToken(req, res) {
//   try {
//     const resultado = await db.query(`SELECT 
//     rentals.id, 
//     rentals."customerId", 
//     rentals."gameId", 
//     rentals."rentDate", 
//     rentals."daysRented", 
//     rentals."returnDate", 
//     rentals."originalPrice", 
//     rentals."delayFee", 
//     customers.name AS "nomeCliente", 
//     games.name AS "nomeJogo"
//   FROM 
//     rentals 
//     JOIN customers ON rentals."customerId" = customers.id 
//     JOIN games ON rentals."gameId" = games.id;`);


//     const alugueis = resultado.rows.map(row => {
//         const { 
//             id, 
//             customerId, 
//             gameId, 
//             rentDate, 
//             daysRented, 
//             returnDate, 
//             originalPrice, 
//             delayFee, 
//             nomeCliente, 
//             nomeJogo
//         } = row;
        
//         const customer = { id: customerId, name: nomeCliente };
//         const game = { id: gameId, name: nomeJogo };
        
//         return { 
//             id, 
//             customerId, 
//             gameId, 
//             rentDate, 
//             daysRented, 
//             returnDate, 
//             originalPrice, 
//             delayFee, 
//             customer, 
//             game 
//         };
//     });
//     res.send(alugueis)
    
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function ranking(req, res) {
//     const { customerId, gameId, daysRented } = req.body;

//     const validation = alugueisSchema.validate(req.body, { abortEarly: false });
  
//     if (validation.error) {
//       const errors = validation.error.details.map((d) => d.message);
//       return res.status(400).send(errors);
//     }
  
//     try {
//         let returnDate = null;
//         let delayFee = null;
//         let rentDate = new Date().toISOString().slice(0, 10)
//         if(daysRented <= 0) return res.sendStatus(400);
        
//       const clienteExiste = await db.query("SELECT * FROM customers WHERE id = $1", [customerId]);
//       if (clienteExiste.rows.length == 0) return res.sendStatus(400);

//       const jogoExiste = await db.query("SELECT * FROM games WHERE id = $1", [gameId]);
//       if (jogoExiste.rows.length == 0) return res.sendStatus(400);
    
//       const originalPrice = daysRented * jogoExiste.rows[0].pricePerDay;


//       const jogoDisponivel = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" is null;`, [gameId]);
//       if (jogoDisponivel.rows.length >= jogoExiste.rows[0].stockTotal) return res.sendStatus(400);
  
//       await db.query(
//         `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//         [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
//       );
//       res.sendStatus(201);
//     } catch (err) {
//       res.status(500).send(err.message);
//     } 
  }

export async function finalizarAluguel(req, res) {
//     const {id} = req.params;
//   try {
//     const returnDate = new Date().toISOString().slice(0, 10)
    
//     const aluguelExiste = await db.query(`SELECT rentals.*, games."pricePerDay"
//     FROM rentals 
//     JOIN games ON rentals."gameId" = games.id
//     WHERE rentals."id"=$1`, [id]);

//     if (aluguelExiste.rows.length == 0) return res.sendStatus(404);
//     if(aluguelExiste.rows[0].returnDate !== null) return res.sendStatus(400);

//     const { rentDate, daysRented, pricePerDay } = aluguelExiste.rows[0];
//     const atraso = Math.max(Math.floor((Date.now() - (new Date(rentDate)).getTime() - (daysRented * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)), 0);
//     const delayFee = atraso > 0 ? atraso * pricePerDay : null;
    
//     await db.query(`
//     UPDATE rentals
//     SET "returnDate" = $1, "delayFee" = $2
//     WHERE "id" = $3;
// `, [returnDate, delayFee, id]);


//     res.sendStatus(200)
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}

export async function apagarAluguel(req, res) {
//     const {id} = req.params;
//   try {
//     const idExiste = await db.query(`SELECT * FROM rentals WHERE id=$1`,[id]);
//     if(idExiste.rows.length === 0) return res.sendStatus(404);
//     if(idExiste.rows[0].returnDate === null) return res.sendStatus(400);

//     await db.query(`DELETE FROM rentals WHERE id=$1`,[id])
//     res.sendStatus(200);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
}
