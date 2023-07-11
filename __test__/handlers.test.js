const handlers = require( '../handlers' )

test( 'testing home page', () => {
    const req = {},
    res = { render: jest.fn() }
    handlers.home( req, res )
    expect( res.render.mock.calls[ 0 ][ 0 ] ).toBe( 'index' )
})