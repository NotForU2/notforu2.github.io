var AStar = {
    edgesAlg: [],

    solveEdges: [],
    solveNodes: [],

    deadNodes: [],
    deadEdges: [],

    Q: [],
    U: [],

    initAlgorithm: function (edges) {
        this.edgesAlg = edges;
        this.solveEdges = [];
        this.solveNodes = [];
        this.deadNodes = [];
        this.deadEdges = [];
        this.Q = [];
        this.U = [];
    },

    heuristic: function (from, to) {
        return to.charCodeAt(0) - from.charCodeAt(0);
    },

    func: function (arr) {
        let x = 0;
        for(let i = 0; i < arr.length-1; i++){
            x += +this.findEdge(this.deadEdges, {source: arr[i], target: arr[i+1]}) + this.heuristic(arr[i], arr[i+1])
        }
        return x;
    },

    findMinF: function () {
        let index = 0;
        let fu = Number.MAX_SAFE_INTEGER;
        for(let i in this.U) {
            let newFu = this.func(this.U[i]);
            if (newFu < fu){
                fu = newFu;
                index = i;
            }
        }
        return index;
    },

    isEmpty: function (obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    },

    setQueue: function(from) {
        return this.edgesAlg.forEach((item) => {
            if(item.source.id === from && !this.Q.includes(item.target.id)) {
                this.deadNodes.push(item.target.id);
                this.deadEdges.push(item);
                if(from === 'a') {
                    this.U.push([from, item.target.id]);
                }
                else {
                    for(let i = 0; i < this.U.length; i++) {
                        if(this.U[i][this.U[i].length-1] === item.source.id) {
                            let arr = this.U[i].concat([item.target.id])
                            this.U.splice(i, 1);
                            this.U.push(arr);
                        }
                    }
                }
            }
        })
    },

    findSolveEdges: function () {
        for(let i=0; i<this.solveNodes.length-1; i++){
            this.solveEdges.push({source:{id:this.solveNodes[i]},target:{id:this.solveNodes[i+1]}});
        }
    },

    findEdge: function (arr, edge) {
        return arr.find(function (item) {
            return (edge.source === item.source.id) && (edge.target === item.target.id);
        })
    },

    fixAll: function () {
        let arr = []
        for(let i = 0; i < this.deadNodes.length; i++){
            if(!this.solveNodes.includes(this.deadNodes[i])){
                arr.push(this.deadNodes[i]);
            }
        }
        this.deadNodes = arr;

        let arr1 = []
        for(let i = 0; i < this.deadEdges.length; i++) {
            if(!this.solveNodes.includes(this.deadEdges[i].source.id) || !this.solveNodes.includes(this.deadEdges[i].target.id)){
                arr1.push(this.deadEdges[i]);
            }
        }
        this.deadEdges = arr1
    },

    wayStep: function (from, to) {
        let index = Object.keys(this.U)[0]
        let tmp = this.U[index][this.U[index].length-1];
        if(tmp === to) {
            return index;
        }
        if(this.Q.includes(tmp)){
            return null;
        }
        this.Q.push(tmp);
        this.setQueue(tmp);
    },

    waySolution: function (from, to) {
       this.Q.push(from);
       this.setQueue(from)
       let index;
       while (!this.isEmpty(this.U)) {
           index = this.findMinF()
           let tmp = this.U[index][this.U[index].length-1];

           if(tmp === to) {
               break;
           }
           if(this.Q.includes(tmp)){
               continue;
           }
           this.Q.push(tmp);
           this.setQueue(tmp);
       }
       this.solveNodes = this.U[index];
       this.fixAll();
       this.findSolveEdges();

    }
}