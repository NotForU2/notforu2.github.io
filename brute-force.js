var bruteForce = {
    edgesAlg: [],

    solveEdges: [],
    solveNodes: [],

    deadNodes: [],
    deadEdges: [],

    initAlgorithm: function (edges) {
        this.edgesAlg = edges;
        this.solveEdges = [];
        this.solveNodes = [];
        this.deadNodes = [];
        this.deadEdges = [];
    },

    findMin: function (from) {
        return this.edgesAlg.reduce((prev, item) => {
            if(item.source.id === from && +item.weight < +prev.weight) {
                let result = this.deadNodes.includes(item.target.id) || this.solveNodes.includes(item.target.id)
                return result ? prev : item;
            }
            return prev;
        }, {source: {id: from}, target:{id: from}, weight: Number.MAX_SAFE_INTEGER})
    },

    wayStep: function (from, to) {
        let res = this.findMin(from);
        if(res.target.id === res.source.id){
            this.deadNodes.push(from);
            this.deadEdges.push(this.solveEdges.pop());
        }
        else {
            this.solveNodes.push(from);
            this.solveEdges.push(res);
        }

        return {
            nextNode: res.target.id,
            doneAlg: res.target.id === to,
            dead: res.target.id === res.source.id
        }
    },

    waySolution: function (from, to) {
        let tmpFrom = from;
        let doneAlg = false;
        let dead = false;
        while(!doneAlg) {
            let way = this.wayStep(tmpFrom, to);
            doneAlg = way.doneAlg;
            dead = way.dead;

            tmpFrom = dead ? this.solveNodes.pop() : way.nextNode;
        }
        this.solveNodes.push(to);
    },

}