from bottle import route, run


@route('/')
def hello():
    return "Hello World!"


@route('/search/<author_name>')
def search_by_author_name(author_name):
    return author_name


@route('/details/<author_id>')
def get_author_details(author_id):
    return author_id


@route('/similar/<author_id>')
def get_similar_authors(author_id):
    return author_id

run(host='localhost', port=8080, debug=True)
