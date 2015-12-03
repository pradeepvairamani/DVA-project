function handlesearch(searched_name){

window.onload = function() {

d3.json("../data/authors.json", function(error, json) {  

var authors= json.authors; 

function* get_author(){
    var index = 0;
    while(true)
        yield authors[index++];
}
var auth_gen = get_author();

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

var global_id = 1;
var curr_grpid = 1;

var small_radius = 10;
var w = window.innerWidth - $(".col-md-3").width() - 100,
    h = window.innerHeight,
    radius = small_radius, node,link,root, text;

function getnodeobj(group,name){
    var obj = new Object();
    obj.group = group;
    obj.x=w/2;
    obj.y=h/2;
    obj.fixed = false;
    obj.id=getid();
    var auth = auth_gen.next().value;
    // console.log(auth);
    // console.log(auth);
    obj.aff = auth.aff;
    if( typeof name == 'undefined' ) {  obj.name = auth.name;/*"sub node " + obj.id;  */  }
    else{ obj.name = name; }
    return obj;
}

//var input = document.getElementById("se_au_na");
//searched_name = input.options[input.selectedIndex].value;;

var srd_index = -1;
for (i = 0; i < authors.length; i++) { 
    if (authors[i].name == searched_name){ srd_index = i; break;   }
}

var words;
if (srd_index != -1){   
    authors.splice(srd_index,1);
    words = [ getnodeobj(getgroup_ni(true),searched_name), ];
}
else{
    words = [ getnodeobj(getgroup_ni(true)), ];   
}

words[0].children = [];
var group = words[0].group;
for (i = 0; i < 10; i++) { 
    words[0].children.push(getnodeobj(group));
}

// words[0].children[words[0].children.length-1].children = [];
// var group = getgroup_ni(true);
// for (i = 0; i < 3; i++) { 
//     words[0].children[words[0].children.length -1].children.push(getnodeobj(group));
// }

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Name:</strong> <span style='color:red'>" + d.name + "</span><br><br>\
            <strong>Affiliation:</strong> <span style='color:red'>" + d.aff + "</span><br><br>\
            <strong>ExploreCount:</strong> <span style='color:red'>" + d.group + "</span>";
            //<strong>Major FOS:</strong> <span style='color:red'>" + 'Applied Science' + "</span><br><br>\
            //<strong>Color:</strong> <span style='color:red'>" + color(d) + "</span>
  })

var force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { return d.group == curr_grpid ? -1500 : -700; })
    .linkDistance(function(d) { return (d.source.group == curr_grpid) ||(d.source.id == global_id) ? 2000/small_radius : 250/small_radius; })
    .size([w, h - 160]);

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

svg.call(tip);

root = words[0];
update();

function update() {
    d3.selectAll("svg > *").remove();
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
        .text(function(d) { return d.name; })
        
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

    text = svg.selectAll("text.node")
        .attr("class", "node")
        .data(nodes)
        .enter().append("svg:text")
        .filter(function(d){ return (d.group == curr_grpid) ||((d.id != global_id)&&(d.children != null)); })
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "brown")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    
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
            if(d.id != global_id){  d.fixed = false;  }
            else{   d.x = w/2;  d.y = h/2;    }
            
            return d.x = Math.max(radius, Math.min(w - radius, d.x)); 
        })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(h - radius, d.y)); })
        .attr("r", function(d){
                if(d.id == global_id){ return small_radius * 2.5; }
                return small_radius;            
        })
        .style("stroke", function(d){
            if(d.id == global_id){ return "black"; }
            return "black";            
        })
        .style("stroke-width", function(d){
            if(d.id == global_id){
                $(".profile-usertitle-name").text(d.name);
                $(".profile-usertitle-job").text(d.aff);
                //console.log(d);
                return 5;
            }
            return 1;            
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    //node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    text.filter(function(d){return (d.group == curr_grpid) ||((d.id != global_id)&&(d.children != null));})
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    
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
        d._children = null;
        d.children = [];
        var group = getgroup_ni(true);
        curr_grpid = group;
        for (i = 0; i < 10; i++) { 
            d.children.push(getnodeobj(group));
        }
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

var colorarr = d3.scale.category10();
// Color leaf nodes orange, and packages white or blue.

function color(d) {
    //return color(d.group % 10)-1);
    group = d.group % 9 + 1;
    switch(group) {
        case 1: return "#e74c3c"; break;
        case 2: return "#3498db"; break;
        case 3: return "#2ecc71"; break;
        case 4: return "#e78229"; break;
        case 5: return "#9b59b6"; break;
        case 6: return "#b10026"; break;
        case 7: return "#1f77b4"; break;
        case 8: return "#ff7f0e"; break;
        case 9: return "#2ca02c"; break;
    }
}
});
};

// node.enter().append("svg:text")
    //     .attr("class", "text")
    //   .attr("dx", 12)
    //   .attr("dy", ".35em")
    //   .text(function(d) { return d.name })
    // .attr("font-family", "sans-serif")
    // .attr("font-size", "8px")
    // .attr("font-weight", "bold")
    // .attr("fill", "red");
        
}