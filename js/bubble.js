window.onload = function() {

function getgroup_ni(if_inc){
    if( typeof getgroup_ni.counter == 'undefined' ) {
            getgroup_ni.counter = 1;  
        }
    var temp = getgroup_ni.counter;
    if(if_inc){
        getgroup_ni.counter++;
    }
    return temp;
}

words = [
    {
        "group":getgroup_ni(false),
        "word":"main node",
        "children":[
            {
                "group":getgroup_ni(false),
                "name":"sub node 1"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 2"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 3"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 4"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 5"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 6"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 7"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 8"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 9"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 10"
            },
            {
                "group":getgroup_ni(false),
                "name":"sub node 11"
            },
            {
                "group":getgroup_ni(true),
                "name":"sub node 12",
                "children":[
                    {
                        "group":getgroup_ni(false),
                        "name":"sub sub node 1"
                    },
                    {
                        "group":getgroup_ni(false),
                        "name":"sub sub node 2"
                    },
                    {
                        "group":getgroup_ni(true),
                        "name":"sub sub node 3"
                    }
                ]
            }
        ]
    }
];

var w = window.innerWidth - $(".col-md-3").width() - 100,
    h = window.innerHeight,
    radius = 10,
    node,
    link,
    root;
console.log("height" +h);
console.log("width" +w);
var force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { return -300; })
    .linkDistance(function(d) { return d.target._children ? 100 : 50; })
    .size([w, h - 160]);

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

root = words[0]; //set root node
root.fixed = true;
root.x = w / 2;
root.y = h / 2 - 80;
update();

function update() {
    // window.alert(svg);
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

    // Enter any new links.
    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();

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
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();
}

function tick() {
    node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(w - radius, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(h - radius, d.y)); });

          link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
    group = d.group % 5;
    if(d._children){
        return "#95a5a6";
    }else{
        switch(group) {
            case 1: //adverb
                return "#e74c3c";
                break;
            case 2: //noun
                return "#3498db";
                break;
            case 3: //verb
                return "#2ecc71";
                break;
            case 4: //adjective
                return "#e78229";
                break;
            case 5: //adjective
                return "#9b59b6";
        }
    }
}

// Toggle children on click.
function click(d) {
    $.get("http://localhost:8082/",function(data){
        // window.alert(data);
        // console.log("was2");
    }).fail(function(){
        // window.alert("hney");
    });
    console.log("was");
    if (d.children) {
        // root.children.push({
        //                 "group":"p",
        //                 "name":"sub sub node 9"
        //             });
            // d.children.push({
            //                 "group":getgroup_ni(false),
            //                 "name":"sub sub node 9"
            //             });
        d._children = d.children;
        d.children = null;
    } else {
        d._children = [];
        var group = getgroup_ni(true);
        for (i = 0; i < 10; i++) { 

        d._children.push({
                        "group":group,
                        "name":"sub sub node 9"
                    });
        }
        d.children = d._children;
        d._children = null;
    }
    update();
}

function dblclick(d) {
    $.get("http://localhost:8082/details/645",function(data){
         window.alert(data);
    });
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
};