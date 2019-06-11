var vm = new Vue({
    el: '#app',
    data: {
        isN1Mode: true,
        numOfTextileCell:24,
        cellSize: 18,
        cellMargin: 2,
        numOfPedal: 4,
        numOfRale: 4,
        rale: [],
        pedal: [],
        link: [],//配列の見た目と表示順が違う(配列左側が表示時上になる)。注意。[ペダル本目][レールナンバー]。
    },
    methods: {
        btn11Clicked(){
            this.isN1Mode = false;
        },
        btnN1Clicked(){
            this.isN1Mode = true;
        },
        //n,kは1から始まる。vueの仕組みにあわせた
        setRale(n, k) {
            this.rale.splice(n - 1, 1, k - 1);
        },
        setLink(n, k) {
            this.link[n - 1].splice(k - 1, 1, !this.link[n - 1][k - 1]);
        },
        setPedal(n, k) {
            this.pedal.splice(n - 1, 1, k - 1);
        },
        allRandom() {
            var v = 1 + Math.floor(Math.random() * 4);
            this.setPedal(1, v);
            for (var i = 1; i <= this.pedal.length; i++) {
                do {
                    v = 1 + Math.floor(Math.random() * 4);
                    //i番目のひとつまえはi-1番目だが、配列的には0番目が存在するためi-2番目
                    //（これなんとかしたい）
                } while (v == this.pedal[i - 2] + 1)
                do {
                    w = 1 + Math.floor(Math.random() * 4);
                } while (w == this.rale[i - 2] + 1)
                this.setPedal(i, v);
                this.setRale(i, w);
            }
        },
        init(){
            for(var i=0;i<this.numOfPedal;i++){
                this.link.push([]);
                for(var k=0;k<this.numOfRale;k++){
                    this.link[i].push(false);
                }
            }
            for (var i = 0; i < this.numOfTextileCell; i++) {
                //デフォルトで規則配置
                this.rale.push(i % this.numOfRale);
                this.pedal.push(i % this.numOfPedal);//なお1on1モードの場合はpedal配列はtrueかfalseの配列が入った二次元配列になる。
            }
        }
    },
    computed: {
        cellSizeWithMargin:function(){
            return this.cellSize + this.cellMargin;
        },
        pedalAreaWidth: function () {
            return this.cellSize * this.numOfPedal + this.cellMargin * (this.numOfPedal - 1)
        },
        pedalAreaHeight:function(){
            return this.cellSize * this.numOfTextileCell + this.cellMargin * (this.numOfTextileCell -1)
        },
        raleAreaHeight: function(){
            return this.cellSize * this.numOfRale + this.cellMargin * (this.numOfRale - 1)
        },
        raleAreaWidth: function(){
            return this.cellSize * this.numOfTextileCell + this.cellMargin * (this.numOfTextileCell -1)
        },
        downUps: function () {//これの出し方がNon1と1on1で異なる(これはNのほう)
            //1on1の場合リンクは1本目＝ペダル1と固定すればペダル行列がそのままdownup行列になるため計算は不要
            var arr = [];
            for (var i = 0; i < this.pedal.length; i++) {
                arr.push([]);
                for (var k = 0; k < 4; k++) {
                    arr[i].push(this.link[this.pedal[i]][k]);
                }
            }
            return arr;
        },
        cells: function () {
            var arr = [];
            for (var i = 0; i < this.downUps.length; i++) {
                arr.push([]);
                for (var k = 0; k < this.rale.length; k++) {
                    arr[i].push(this.downUps[i][this.rale[k]]);
                }
            }
            return arr;
        },
    },
    created: function () {
        this.init();
    },
    mounted: function () {
    }
});