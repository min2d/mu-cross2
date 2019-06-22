var vm = new Vue({
    el: '#app',
    data: {
        mode: 'N-1',
        textileCol: 12, // width
        textileRow: 24, // height
        cellSize: 18,
        cellMargin: 2,
        numOfRale: 6,
        numOfPedalN1: 4,
        rale: [],
        pedalN1: [],
        pedal11: [], // [ペダルナンバー][レールナンバー]=boolean
        linkN1: [],// 表示する向きが配列の見た目通りではない([0][0]は左上,[0][n]は左下)。[ペダルナンバー][レールナンバー]= boolean
        link11: [],// [ペダルナンバー] = number配列
    },
    methods: {
        changeModeTo(str) {
            this.mode = str;
            this.init();
        },
        //n,kは1から始まる。vueの仕組みにあわせた
        setRale(n, k) {
            this.rale.splice(n - 1, 1, k - 1);
        },
        setLinkN1(n, k) {
            this.linkN1[n - 1].splice(k - 1, 1, !this.linkN1[n - 1][k - 1]);
        },
        setLink11(n, k) {
            this.link11.splice(n - 1, 1, k - 1);
        },
        setPedalN1(n, k) {
            this.pedalN1.splice(n - 1, 1, k - 1);
        },
        setPedal11(n,k){
            this.pedal11[n - 1].splice(k - 1, 1, !this.pedal11[n - 1][k - 1]);
        },
        allRandom() {
            var v = 1 + Math.floor(Math.random() * this.numOfPedal);
            this.setPedalN1(1, v);
            for (var i = 1; i <= this.textileRow; i++) {
                do {
                    v = 1 + Math.floor(Math.random() * this.numOfPedal);
                    //i番目のひとつまえはi-1番目だが、配列的には0番目が存在するためi-2番目
                } while (v == this.pedalN1[i - 2] + 1)
                do {
                    w = 1 + Math.floor(Math.random() * this.numOfRale);
                } while (w == this.rale[i - 2] + 1)
                this.setPedalN1(i, v);
                this.setRale(i, w);
            }
        },
        initN1() {
            this.linkN1 = [];
            this.pedalN1 = [];
            this.rale = [];

            for (var i = 0; i < this.numOfPedal; i++) {
                this.linkN1.push([]);
                for (var k = 0; k < this.numOfRale; k++) {
                    this.linkN1[i].push((i + k) % 2 == 0);
                }
            }
            for (var i = 0; i < this.textileCol; i++) {
                //デフォルトで規則配置
                this.rale.push(i % this.numOfRale);
            }
            for (var i = 0; i < this.textileRow; i++) {
                this.pedalN1.push(i % this.numOfPedal);
            }
        },
        init11() {
            this.link11 = [];
            this.pedal11 = [];
            this.rale = [];

            for (var i = 0; i < this.numOfPedal; i++) {
                this.link11.push(i % this.numOfPedal);
            }
            for (var i = 0; i < this.textileCol; i++) {
                //デフォルトで規則配置
                this.rale.push(i % this.numOfRale);
            }
            for (var i = 0; i < this.textileRow; i++) {
                this.pedal11.push([]);
                for (var k = 0; k < this.numOfPedal; k++) {
                    this.pedal11[i].push((i + k) % 2 == 0);
                }
            }
        },
        init() {
            this.initN1();
            this.init11();
        }


    },
    computed: {
        numOfPedal() {
            if (this.mode == "N-1") {
                return this.numOfPedalN1;
            } else if (this.mode = "1-1") {
                return this.numOfRale;
            }
        },
        cellSizeWithMargin: function () {
            return this.cellSize + this.cellMargin;
        },
        pedalAreaWidth: function () {
            return this.cellSize * this.numOfPedal + this.cellMargin * (this.numOfPedal - 1)
        },
        pedalAreaHeight: function () {
            return this.cellSize * this.textileRow + this.cellMargin * (this.textileRow - 1)
        },
        raleAreaHeight: function () {
            return this.cellSize * this.numOfRale + this.cellMargin * (this.numOfRale - 1)
        },
        raleAreaWidth: function () {
            return this.cellSize * this.textileCol + this.cellMargin * (this.textileCol - 1)
        },
        downUpsN1: function () {//これの出し方がNon1と1on1で異なる(これはNのほう)
            var arr = [];
            for (var i = 0; i < this.textileRow; i++) {
                arr.push([]);
                for (var k = 0; k < this.numOfRale; k++) {
                    arr[i].push(this.linkN1[this.pedalN1[i]][k]);
                }
            }
            return arr;
        },
        downUps11: function () {
            var arr = [];
            for (var row = 0; row < this.textileRow; row++) {
                arr.push([]);
                for (var rale = 0; rale < this.numOfRale; rale++) {
                    arr[row].push(false);
                }
                for( var pedal = 0; pedal < this.numOfPedal; pedal++){
                    if(this.pedal11[row][pedal]){
                        //this.link11[pedal]=下がるレールナンバー なので
                        arr[row][this.link11[pedal]]=true;
                    }
                }
            }

            return arr;
        },
        cells: function () {
            var arr = [];
            let downUps;
            if (this.mode == "N-1") {
                downUps = this.downUpsN1;
            } else if (this.mode = "1-1") {
                downUps = this.downUps11;
            }
            for (var i = 0; i < downUps.length; i++) {
                arr.push([]);
                for (var k = 0; k < this.rale.length; k++) {
                    arr[i].push(downUps[i][this.rale[k]]);
                }
            }
            return arr;
        },
    },
    created: function () {
        this.initN1();
        this.init11();
    },
    mounted: function () {
    }
});