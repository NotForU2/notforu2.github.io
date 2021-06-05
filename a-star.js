var AStar = {
    edgesAlg: [],

    solveEdges: [],
    solveNodes: [],

    deadNodes: [],
    deadEdges: [],

    gScore: {},
    fScore: {},

    cameFrom: {},
    openSet: [],
    closeSet: [],

    initAlgorithm: function (edges) {
        this.edgesAlg = edges;
        this.gScore = {};
        this.fScore = {};
        this.cameFrom = {};
        this.openSet = [];

        this.solveEdges = [];
        this.solveNodes = [];
        this.deadNodes = [];
        this.deadEdges = [];
    },

    h: function (ch, f) {
        return Math.abs(ch.charCodeAt(0) - f.charCodeAt(0))
    },

    minH: function (openSet, to) {
       let min = openSet[0];
       for(let i = 1; i < openSet.length; i++){
            if(Number.parseInt(this.fScore[openSet[i]]) < Number.parseInt(this.fScore[min])){
                min = openSet[i]
            }
            else if(Number.parseInt(this.fScore[openSet[i]]) === Number.parseInt(this.fScore[min])){
                if(this.h(openSet[i], to) < this.h(min, to)) {
                    min = openSet[i]
                }
            }
       }
       return min
    },

    getNeighbors: function (from) {
        let res = [];
        for(let i = 0; i < this.edgesAlg.length; i++){
            if(this.edgesAlg[i].source.id === from) {
                res.push(this.edgesAlg[i]);
            }
        }
        return res;
    },

    reconstructPath: function (cameFrom, current) {
        let res = []
        let tmp = current;
        while(tmp) {
            res.push(tmp)
            tmp = cameFrom[tmp];
        }
        return res.reverse();
    },

    pullSolve: function (result) {
        for(let i = 0; i < result.length; i++){
            this.solveNodes.push(result[i]);
            if(this.deadNodes.includes(result[i])){
                this.deadNodes.splice(this.deadNodes.indexOf(result[i]), 1);
            }

            if(i !== result.length - 1) {
                let count;
                for(j = 0; j < this.deadEdges.length; j++) {
                    if(this.deadEdges[j].source.id === result[i] && this.deadEdges[j].target.id === result[i+1]){
                        count = j;
                        this.solveEdges.push(this.deadEdges[j]);
                        break;
                    }
                }
                this.deadEdges.splice(count, 1);
            }
        }
    },

    waySolution: function (from, to) {
        this.openSet.push(from);
        this.gScore[from] = 0;

        this.fScore[from] = this.h(from, to);

        while(this.openSet.length !== 0){
            let current = this.minH(this.openSet, to)

            this.deadNodes.push(current);

            if(current === to) {
                let res = this.reconstructPath(this.cameFrom, current);
                this.pullSolve(res);
            }
            
            let neighbors = this.getNeighbors(current);
            
            for(let val of neighbors) {
                let tentativeGScore = Number.parseInt(this.gScore[current]) + Number.parseInt(val.weight)
                let x = val.target.id
                if(!this.openSet.includes(x) && !this.closeSet.includes(x)){
                    this.deadEdges.push(val);

                    this.cameFrom[x] = current
                    this.gScore[x] = Number.parseInt(tentativeGScore);
                    this.fScore[x] = Number.parseInt(this.gScore[x])+this.h(x, to)
                    this.openSet.push(x)
                }
                else {
                    if(tentativeGScore < Number.parseInt(this.gScore[x])){
                            this.deadEdges.push(val);

                            this.cameFrom[x] = current
                            this.gScore[x] = Number.parseInt(tentativeGScore);
                            this.fScore[x] = Number.parseInt(this.gScore[x])+this.h(x, to)
                            if(this.closeSet.includes(x)){
                               this.closeSet.splice(this.closeSet.indexOf(x, 0), 1);
                               this.openSet.push(x);
                            }       
                    }
               
                }
            }
            this.openSet.splice(this.openSet.indexOf(current), 1);
            this.closeSet.push(current)
        }
        return false;
    }
}