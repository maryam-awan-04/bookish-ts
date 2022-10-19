import express from 'express'
import sql from 'mssql'

interface Book {
    bookId: string;
    bookTitle: string;
    author: string;
    isbn: string;
    copies: number;
    availableCopies: number;
    available: boolean;
}

const app = express()
const appPort = 3000
const appHostname = 'localhost'
const serverPort = 1433
const serverHostname = 'localhost'
const serverPassword = 'Bootcamp22!'

const sqlConfig = {
    user: 'sa',
    password: 'Bootcamp22!',
    database: 'BookishDB',
    server: serverHostname,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }

}
    
app.use(express.json())

async function fetchBooks() {
    await sql.connect(sqlConfig)
    const books: Book[] = (await sql.query('select top (1000) * from Books')).recordset
    return books
}

app.get('/', async (_req, res) => {
    const books = await fetchBooks()
    res.status(200).json({
        Message: 'Here is the book catalogue:',
        Books: books.map(book => ({
            blah: "Hey I've got a new attribute yay!",
            BookID: book.bookId,
            BookTitle: book.bookTitle,
            Author: book.author,
            isbn: book.isbn,
            copies: book.copies,
            availableCopies: book.availableCopies,
            available: book.available, 
        }))
    })
})

app.listen(appPort, appHostname, () => {
console.log(
    `API is running at ` +
    `http://${appHostname}:${appPort}`
)})