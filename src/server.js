// servidor criado com apenas 3 linhas
const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")//pode colocar ou nao o .js

// configurar pasta pública 
server.use(express.static("public"))


// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true}))

// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noChache: true
})


// configurar caminhos da minha aplicação
// pagina incial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título"}) // dirname = nome do diretório
})




server.get("/create-point", (req, res) => {

    // req.query: Query Strings da nossa url
    // console.log(req.query)

    return res.render("create-point.html") // dirname = nome do diretório
})

server.post("/savepoint", (req, res) => {
    
    //req.body: o corpo d nosso formulário
    // console.log(req.body)

    // inserir dados no banco de dados
    // 2 inserir dados na tabela
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
        req.body.addres2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err) //faz com que consiga ver o erro que deu, se houver
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this) //ao usar o this, não se utiliza a arrow function

        return res.render("create-point.html", { saved: true})
    }
    db.run(query, values, afterInsertData) 
    
}) 





server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }


    // pegar os dados do banco de dados
    // as % antes e depois do search faz com que nao precise ser exatamente igual o nome digitado

    db.all(`SELECT * FROM places WHERE city  LIKE '%${search}%'`, function(err, rows){
        if (err) {
            return console.log(err) 
        }


        const total = rows.length
        // console.log("Aqui estão os seus registros: ")
        // console.log(rows)
        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total})
    })

     
})


// ligar o servidor
server.listen(3000)
