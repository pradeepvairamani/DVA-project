from bottle import route, run, hook, response


@hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers[
        'Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers[
        'Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


@route('/')
def hello():
    return "Hello World!"


@route('/search/<author_name>')
def search_by_author_name(author_name):
    return author_name


@route('/details/<author_id>')
def get_author_details(author_id):
    return {"author_id": author_id, "name": str(author_id) + "name", "Affiliation":  str(author_id) + "college"}


@route('/similar/<author_id>')
def get_similar_authors(author_id):
    return author_id

run(host='localhost', port=8082, debug=True)
