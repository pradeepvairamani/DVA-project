window.onload = function() {

function getgroup_ni(if_inc){
    if( typeof getgroup_ni.counter == 'undefined' ) {   getgroup_ni.counter = 1;    }
    var temp = getgroup_ni.counter;
    if(if_inc){ getgroup_ni.counter++;  }
    return temp;
}

function getid(){
    if( typeof getid.counter == 'undefined' ) { getid.counter = 1; }
    else{   getid.counter++;    }
    return getid.counter;
}

var w = window.innerWidth - $(".col-md-3").width() - 100,
    h = window.innerHeight,
    radius = 10, node,link,root;

function getnodeobj(group,name){
    var obj = new Object();
    obj.group = group;
    obj.x=w/2;
    obj.y=h/2;
    obj.fixed = false;
    obj.id=getid();
    if( typeof name == 'undefined' ) {  obj.name = name;    }
    else{ obj.name = "sub node " + obj.id;  }
    return obj;
}

words = [ getnodeobj(getgroup_ni(true,"main node")), ];

words[0].children = [];
var group = words[0].group;
for (i = 0; i < 10; i++) { 
    words[0].children.push(getnodeobj(group));
}

words[0].children[words[0].children.length-1].children = [];
var group = getgroup_ni(true);
for (i = 0; i < 3; i++) { 
    words[0].children[words[0].children.length -1].children.push(getnodeobj(group));
}

var force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { return -300; })
    .linkDistance(function(d) { return d.target._children ? 1000/radius : 500/radius; })
    .size([w, h - 160]);

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

root = words[0];
update();
var global_id = 1;

function update() {
    var nodes = flatten(root),
    links = d3.layout.tree().links(nodes);

    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    // Update the links…
    link = svg.selectAll(".link")
        .data(links);

        // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(nodes)
        .style("fill", color);

    node.transition()
        .attr("r", radius);

    node.append("title")
        .text(function(d) { return d.name; });

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", radius)
        .style("fill", color)
        .on("click", click)
        .on("dblclick", dblclick)
        //.call(force.drag);

    // Exit any old nodes.
    node.exit().remove();
    
    // Enter any new links.
    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();
}

function tick() {
    node.attr("cx", function(d) { 
            if(d.id != global_id){  d.fixed = false;    }
            else{   d.x = w/2;  d.y = h/2;    }
            
            return d.x = Math.max(radius, Math.min(w - radius, d.x)); 
        })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(h - radius, d.y)); });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
}

// Toggle children on click.
function click(d) {
    global_id = d.id;
    d.fixed = true;
    $.get("http://localhost:8082/",function(data){
    }).fail(function(){});

    if (d.children) {
        d._children = d.children;
        d.children = null;
    } 
    else {
        d._children = [];
        var group = getgroup_ni(true);
        for (i = 0; i < 10; i++) { 
            d._children.push(getnodeobj(group));
        }
        d.children = d._children;
        d._children = null;
    }
    update();
    tick(); // anyhow called again after this function call, but calling here is just fo flush previous fixed value.
            // In the next auto tick call after this, links will be readjusted on the basis of the new value;
}

function dblclick(d) {
    $.get("http://localhost:8082/details/645",function(data){ window.alert(data); });
}

// Returns a list of all nodes under the root.
function flatten(root) {
    var nodes = [], i = 0;

    function recurse(node) {
        if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
        if (!node.id) node.id = ++i;
        nodes.push(node);
        return node.size;
    }

    root.size = recurse(root);
    return nodes;
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
    group = d.group % 5;
    if(d._children){    return "#95a5a6";    }
    else{
        switch(group) {
            case 1: return "#e74c3c"; break;
            case 2: return "#3498db"; break;
            case 3: return "#2ecc71"; break;
            case 4: return "#e78229"; break;
            case 5: return "#9b59b6"; break;
        }
    }
}

};