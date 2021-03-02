const express = require( "express" );
const router = express.Router();
const {
    nanoid
} = require( "nanoid" );

const idlength = 8

/**
 * @swagger
 * components:
 *  schemas:
 *      Book:
 *          type: object
 *          required:
 *              - title
 *              - author
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the book
 *              title:
 *                  type: string
 *                  description: The book title
 *              author: 
 *                  type: string
 *                  description: The Book author
 *          example:
 *              id: sddsf_fel
 *              title: This Book
 *              author: this Author
 */

/**
 * @swagger
 * tags:
 *     name: Books
 *     description : "books api"
 * 
 */

/**
 * @swagger
 * /books:
 *     get:
 *         summary: returns list of all books
 *         tags: [Books] 
 *         responses: 
 *             200:
 *                 decsription: List of books
 *                 content: 
 *                     application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#components/schemas/Book'
 */

router.get( "/", ( req, res ) => {
    const books = req.app.db.get( "books" )

    res.send( books )
} )

/**
 * @swagger
 * /books/{id}:
 *      get:
 *          summary: get book by ID
 *          tags: [Books]
 *          parameters: 
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: Book ID
 *          responses:
 *              200:
 *                  description: The book description by id
 *                  contents: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Book'
 *              404:
 *                  description: the book not found 
 *                  
 * 
 */

router.get( "/:id", ( req, res ) => {
    const book = req.app.db.get( "books" ).find( {
        id: req.params.id
    } ).value()

    res.send( book )
} )

/**
 * @swagger
 * /books:
 *  post:
 *      summary: Create new Book
 *      tags: [Books]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *          200:
 *              description: the booke was succesfully created
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Book'
 *          500:
 *              desscription: server error
 */

router.post( "/", ( req, res ) => {
    try {
        const book = {
            id: nanoid( idlength ),
            ...req.body
        }
        req.app.db.get( "books" ).push( book ).write();
        res.send( book );
    } catch ( error ) {
        return res.status( 500 ).send( error )
    }
} )

/**
 * @swagger
 * /books/{id}:
 *      put:
 *          summary: update book by ID
 *          tags: [Books]
 *          parameters: 
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: The Book ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          responses:
 *              200:
 *                  description: The book was updated
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Book'
 *              404:
 *                  description: book not found
 *              500:
 *                  description: server error
 */

router.put( "/:id", ( req, res ) => {
    try {
        req.app.db.get( "books" ).find( {
            id: req.params.id
        } ).assign( req.body ).write()

        res.send( req.app.db.get( "books" ).find( {
            id: req.params.id
        } ) )
    } catch ( error ) {
        return res.status( 500 ).send( error )
    }
} )

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *      summary: Remove the book by id
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the book id
 *      responses:
 *          200:
 *              description: the book was removed
 *          404: 
 *              description: the book was not found
 * 
*/
router.delete( "/:id", ( req, res ) => {
    req.app.db.get( "books" ).remove( {
        id: req.params.id
    } ).write()

    res.sendStatus( 200 )
} )

module.exports = router;