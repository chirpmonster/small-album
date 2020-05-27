new Vue({
    el: '#main',
    data: {
        folder: [],
        imgList: [[]],
        showImg: [],
        cover: [],
        showCover: [],
        folderName: '',
        show: true,
        date: '',
        page: 0
    },
    created: function () {
        this.init();
    },
    methods: {
        read: function (callback) {
            let _this = this;
            axios.get('http://127.0.0.1:8888', {
                params: {
                    //当前文件名，最初为空
                    folderName: _this.folderName,
                    date: _this.date
                }
            }).then
            (function (res) {
                //字符串转数组
                callback(res.data.split(','));
            }, function (err) {
                console.log(err);
            });
        },
        //读目录
        init: function () {
            this.date = new Date();
            let _this = this;
            let temp = [];
            _this.read(function (data) {
                //获取全部文件夹
                _this.date = '';
                _this.folder = data;
                for (let i = 0; i < _this.folder.length; i++) {
                    _this.folderName = _this.folder[i];
                    //把i和_this.folderName作为参数传递进异步指令
                    (function (i, folderName) {
                        _this.read(function (data) {
                            _this.imgList[i] = data;
                            //图片监听的是3000
                            _this.imgList[i] = _this.imgList[i].map(x => 'http://127.0.0.1:3000/img/' + folderName + '/' + x);
                            //取出封面，放在temp里，然后交给封面数组（因为:src无法读取img[][]这种二维数组）
                            temp[i] = _this.imgList[i][0];
                            if (i === _this.folder.length - 1) {
                                _this.cover = temp;
                            }
                            _this.loadCover();
                        })
                    })(i, _this.folderName)
                }
            });
        },
        //查看图片
        enter: function (index) {
            this.showCover=[];
            this.showImg = this.imgList[index];
            this.show = false;
            console.log(this.showImg);
            // let _this = this;
            // this.folderName = this.folder[index];
            // this.read(function (data) {
            //     _this.img = data;
            //     _this.img = _this.img.map(x => 'http://127.0.0.1:8888/img/' + _this.folderName + '/' + x);
            //     console.log(_this.img);
            // });
        },
        //返回主页
        back: function () {
            this.show = true;
            this.showImg = [];
            this.loadCover();
        },
        nextPage: function () {
            this.showCover=[];
            if (this.page * 8 + 9 <= this.folder.length)
                this.page++;
            this.loadCover();
        },
        frontPage: function () {
            this.showCover=[];
            if (this.page > 0)
                this.page--;
            this.loadCover();
        },
        loadCover: function () {
            let _this=this;
            clearInterval();
            setTimeout(function () {
            let temp = [];
            for (let i = 0; i < 8; i++)
                temp[i] = _this.cover[_this.page * 8 + i];
            _this.showCover = temp;
            },1)
        }
    }
});