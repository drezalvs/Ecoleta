const express = require("express") // require igual função
const server = express() // recebeu a função p executar no server

// ligar o servidor 
server.listen(3000) // listen ouvir porta 3000
// servidor iniciado acima

// pegar o banco de dados
const db = require("./database/db")


// configurar pasta public
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))


// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true // guardando coisas na memoria p te responder mais rapido
})


// configurar caminhos da minha aplicação 
//página inicial

server.get("/", (req, res) => { //dois ou mais argumentos = req res
// get = http pedindo a / rodando a função
// req: requisição / res: resposta
return res.render("index.html", { title: "Andreza taokei"}) //configurou o caminho barra para executar essa função
//para quando chegar na função, puxar a página index.html // h1 dinamico com nunjucks
})



// configurando todas as rotas
server.get("/create-point", (req, res) => { 
   
   //req.query: query strings da nossa url 
  
   //console.log(req.query)
   
   return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // req.body = o corpo do formulário
    //console.log(req.body)

    //inserir dados no banco de dados
      const query = `
     INSERT INTO places (
         image,
          name,
          address,
          address2,
          state,
          city,
          items
      ) VALUES (?,?,?,?,?,?,?);
  `

  const values = [
     req.body.image,
     req.body.name,
     req.body.address,
     req.body.address2,
     req.body.state,
     req.body.city,
     req.body.items
     
  ]

  function afterInsertData(err) {
      if(err) {
          console.log(err)
          return res.send("Erro no cadastro")
      }

      console.log("Cadastrado com sucesso")
      console.log(this)

      return res.render("create-point.html", { saved: true })

  }

  db.run(query, values, afterInsertData)

  
})



server.get("/search", (req, res) => { 

    const search = req.query.search

    if(search == "" ) {
        // pesquisa vazia
         return res.render("search-results.html", { total: 0})

    }




    // pegar os dados do banco de dados
    // sul
    //chapadão do sul
    // rio do sul
    // sulamericana - ideias da porcentagem
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
            if(err) {
                return console.log(err)
            }
            
           const total = rows.length

            // mostrar a pag html com os dados do banco de dados
            return res.render("search-results.html", { places: rows, total: total})
        }) 


})
