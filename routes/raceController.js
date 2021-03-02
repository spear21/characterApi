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
 *      Race:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the race
 *              name:
 *                  type: string
 *                  description: The race Name 
 *              abilityBonuses:
 *                  type: array
 *                  description: Race bonuses
 *              details:
 *                  type: string
 *                  description: brief detail of race 
 *          example:
 *              id: O9oELOcM
 *              name: Human
 *              abilityBonuses: []
 *              details: Humans are the most adaptable and ambitious people among the common races.
 *              
 */

 /**
  * @swagger
  * tags:
  *     name: Race
  *     description : "Race of Character api"
  * 
  */

/**
 * @swagger
 * /race:
 *     get:
 *         summary: returns list of all racees
 *         tags: [Race] 
 *         responses: 
 *             200:
 *                 decsription: List of race
 *                 content: 
 *                     application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#components/schemas/Race'
 */

router.get( "/", ( req, res ) => {
    const race = req.app.db.get( "race" )

    res.send( race )
} )

/**
 * @swagger
 * /race/{id}:
 *      get:
 *          summary: get race by ID
 *          tags: [Race]
 *          parameters: 
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: race ID
 *          responses:
 *              200:
 *                  description: The race description by id
 *                  contents: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Race'
 *              404:
 *                  description: the race not found 
 *                  
 * 
 */

router.get( "/:id", ( req, res ) => {
    const race = req.app.db.get( "race" ).find( {
        id: req.params.id
    } ).value()

    res.send( race )
} )

/**
 * @swagger
 * /race:
 *   post:
 *      summary: Create new Race
 *      tags: [Race]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Race'
 *      responses:
 *          200:
 *              description: the Race was succesfully created
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Race'
 *          500:
 *              desscription: server error
 */

router.post( "/", ( req, res ) => {
    try {
        const race = {
            id: nanoid( idlength ),
            ...req.body
        }
        req.app.db.get( "race" ).push( race ).write();
        res.send(race);
    } catch ( error ) {
        return res.status( 500 ).send( error )
    }
} )

/**
 * @swagger
 * /race/{id}:
 *      put:
 *          summary: update race by ID
 *          tags: [Race]
 *          parameters: 
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: The Race ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Race'
 *          responses:
 *              200:
 *                  description: The race was updated
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Race'
 *              404:
 *                  description: race not found
 *              500:
 *                  description: server error
 */

router.put( "/:id", ( req, res ) => {
    try {
        req.app.db.get( "race" ).find( {
            id: req.params.id
        } ).assign( req.body ).write()

        res.send( req.app.db.get( "race" ).find( {
            id: req.params.id
        } ) )
    } catch ( error ) {
        return res.status( 500 ).send( error )
    }
} )

/**
 * @swagger
 * /race/{id}:
 *  delete:
 *      summary: Remove the race by id
 *      tags: [Race]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the race id
 *      responses:
 *          200:
 *              description: the race was removed
 *          404: 
 *              description: the race was not found
 * 
*/

router.delete( "/:id", ( req, res ) => {
    req.app.db.get( "race" ).remove( {
        id: req.params.id
    } ).write()

    res.sendStatus( 200 )
} )

module.exports = router;