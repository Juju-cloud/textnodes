/**
 * SERVER>CLIENT comms. 
 * - send initial database from server ONCE.
 * - Assign it to the model defaultDb.
 * - on upload, add new node:
 * - send it to server, 
 * - and back to client
 * - update graph with new database. 
 * 
 * AUDIO
 * - 
 */



// model view controller
// init , UI , events

// import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import ForceGraph3D from '3d-force-graph';
// import { socket } from "./main.js"

/**
 * these css vars are also in waveform.js. could be refactored in main.js and imported here. 
// Get the root element
*/
const root = document.documentElement;
const style = getComputedStyle(root);
const colorPri = style.getPropertyValue("--c-pri");
const colorGraph = style.getPropertyValue("--c-graph");

const Graph = ForceGraph3D();

// class Database {
//     nodes = []
//     links = []
//     constructor(nodes, links) {
//         this.nodes = nodes
//         this.links = links
//     }
// }
const defaultDb = {
  nodes: [
    { id: "1" }, 
    { id: "2" }],
  links: [
    {
      source: "1",
      target: "2",
      value: 10,
    }
  ],
};

// create a function that happens every second and add variable i++. 
let i = 3;
setInterval(() => {
  let target = findTarget()
  console.log(i);
  i.toString()
  console.log(i);
  defaultDb.nodes.push({ id: i });
  defaultDb.links.push({source: i, target: target});
  // console.log(defaultDb)
  Graph.graphData(defaultDb)
  console.log(defaultDb)
  i++
}, 1000);
console.log(defaultDb.nodes.length);
function findTarget() {
  let countN = defaultDb.nodes.length-2;
  let index = Math.round(Math.random() * countN)
  let newTarget = defaultDb.nodes[index].id;
  newTarget.toString()
  return newTarget 
}



/**
 * want to add new nodes to the initial database
 */
// let newNode = {
//   nodes: [
//     { id: "juju" }
//   ]
// }
// Object.assign(defaultDb.nodes, newNode.nodes);
// console.log(newNode)
// console.log(defaultDb)

export function initGraph() {
  window.addEventListener("resize", resizeGraph);
  
  const graphCont = document.getElementById("GRAPH");
  
  graphCont.style.left = 100 + "px";

  Graph(graphCont)
    .backgroundColor(colorGraph)
    .linkOpacity(1)
    .linkWidth(0.1)
    .linkColor("#0F0")
    .graphData(defaultDb)
    .nodeThreeObject((node) => {
      const sprite = new SpriteText(node.id);
      sprite.material.depthWrite = false;
      sprite.color = colorPri;
      sprite.fontFace = "Helvetica";
      sprite.textHeight = 5;
      return sprite;
    })
    .nodeLabel("id")
    .onNodeClick((node) => {
      trigAudioGraph(node)
    })

  Graph.d3Force("charge").strength(-30);
  Graph.d3Force("link").distance(30);
  Graph.d3Force("center")
    .x((w) => w.width / 2)
    .y((h) => h.height / 2);

  resizeGraph();
}

function resizeGraph() {
  const navw = 200;
  const navh = 200;
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  Graph.width(ww - navw).height(wh - navh);
}

// function generateParticles(coord) {
//   Graph.emitParticle(coord);
// }

function trigAudioGraph(node) {
    // audio panning:
  const coord = {
    id: node.id,
    x: node.x,
    y: node.y,
    z: node.z,
  };
  const links = Graph.graphData().links;
  const nodeSiblings = links.filter(
    (link) => link.source.id === node.id || link.target.id === node.id,
  );
  console.log(nodeSiblings);
  // generateParticles(nodeSiblings[0].source, nodeSiblings[0].target);
  // console.log(coord);
};

