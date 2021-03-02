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
 *      Classes:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the classes
 *              name:
 *                  type: string
 *                  description: The classes Name
 *              
 *          example:
 *              id: sddsf_fel
 *              name: Cleric
 *              
 */

 /**
  * @swagger
  * tags:
  *     name: Classes
  *     description : "Class of Character api"
  * 
  */

/**
 * @swagger
 * /classes:
 *     get:
 *         summary: returns list of all classeses
 *         tags: [Classes] 
 *         responses: 
 *             200:
 *                 decsription: List of classes
 *                 content: 
 *                     application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#components/schemas/Classes'
 */

router.get( "/", ( req, res ) => {
    const classes = req.app.db.get( "classes" )

    res.send( classes )
} )

/**
 * @swagger
 * /classes/{id}:
 *      get:
 *          summary: get classes by ID
 *          tags: [Classes]
 *          parameters: 
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: classes ID
 *          responses:
 *              200:
 *                  description: The classes description by id
 *                  contents: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Classes'
 *              404:
 *                  description: the classes not found 
 *                  
 * 
 */

router.get( "/:id", ( req, res ) => {
    const classes = req.app.db.get( "classes" ).find( {
        id: req.params.id
    } ).value()

    res.send( classes )
} )

/**
 * @swagger
 * /classes:
 *     post:
 *      summary: Create new Book
 *      tags: [Classes]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Classes'
 *      responses:
 *          200:
 *              description: the Class was succesfully created
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Classes'
 *          500:
 *              desscription: server error
 */

router.post( "/", ( req, res ) => {
    try {
        const classes = {
            id: nanoid( idlength ),
            ...req.body
        }
        req.app.db.get( "classes" ).push( classes ).write();
        res.send(classes);
    } catch ( error ) {
        return res.status( 500 ).send( error )
    }
} )

/**
 * @swagger
 * /classes/{id}:
 *      put:
 *          summary: update class by ID
 *          tags: [Classes]
 *          parameters: 
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: The Class ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Classes'
 *          responses:
 *              200:
 *                  description: The class was updated
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Classes'
 *              404:
 *                  description: class not found
 *              500:
 *                  description: server error
 */

router.put( "/:id", ( req, res ) => {
    try {
        req.app.db.get( "classes" ).find( {
            id: req.params.id
        } ).assign( req.body ).write()

        res.send( req.app.db.get( "classes" ).find( {
            id: req.params.id
        } ) )
    } catch ( error ) {
        return res.status( 500 ).send( error )
    }
} )

/**
 * @swagger
 * /classes/{id}:
 *  delete:
 *      summary: Remove the class by id
 *      tags: [Classes]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the class id
 *      responses:
 *          200:
 *              description: the class was removed
 *          404: 
 *              description: the class was not found
 * 
*/

router.delete( "/:id", ( req, res ) => {
    req.app.db.get( "classes" ).remove( {
        id: req.params.id
    } ).write()

    res.sendStatus( 200 )
} )

module.exports = router;