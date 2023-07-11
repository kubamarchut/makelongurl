exports.home = ( req, res ) => {
    console.log("New visit on index".green);
    res.render( 'index' );
}