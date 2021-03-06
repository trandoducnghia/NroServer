const { forEach } = require('../../../Model/BaCay/chat');
let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let info =  require('../../../Model/users/info');
let sodu =  require('../../../Model/users/sodu');
let gamecuoc = require('../../../Model/CSMM/cuoc')

let server = function(client,data = {})
{ 
   
    Promise.all([
        new Promise(
            (res,fai) => {
                mysqli.query("SELECT * FROM `phien` WHERE `server` = '"+data.server+"' ORDER BY id DESC LIMIT 1 ",function(err,phien){
                    try 
                    {
                        res(phien);
                    }
                    catch(e){
                        console.log(e);
                        res([]);
                    }
                })
            }
        )
    ]).then(e => {
        let phien = e[0]; 
        if(phien.length <=0)
        {
            client.dn({
                loading : -1,
                loadserver : 
                {
                    chan: 0,
                    id: 0,
                    le: 0,
                    server: data.server,
                    ketqua : 0,
                    tai: 0,
                    time: 0,
                    xiu: 0,
                }
            });
        }
        else 
        {
            phien = phien[0];
           
            Promise.all([
                new Promise(
                    (res,fai) => {  mysqli.query("SELECT SUM(vangcuoc) as tiencuoc FROM `cuoc` WHERE `phien` =  '"+phien.id+"' AND `cuoc` = 'chan'",function(err, cuoc){
                        try 
                        {
                            if(cuoc.length >=1)
                            {
                                res(cuoc[0].tiencuoc);
                            }
                            else 
                            {
                                res(0);
                            }
                        }
                        catch(e)
                        {
                            res(0)
                        }
                    })
                }
                ),
                new Promise(
                    (res,fai) =>  { mysqli.query("SELECT SUM(vangcuoc) as tiencuoc FROM `cuoc` WHERE `phien` =  '"+phien.id+"' AND `cuoc` = 'le'",function(err, cuoc){
                       try 
                       {
                        if(cuoc.length >=1)
                        {
                            res(cuoc[0].tiencuoc);
                        }
                        else 
                        {
                            res(0);
                        }
                       }
                       catch(e)
                       {
                           console.log(e)
                           res(0)
                       }
                    })
                }
                ),
                new Promise(
                    (res,fai) => { mysqli.query("SELECT SUM(vangcuoc) as tiencuoc FROM `cuoc` WHERE `phien` =  '"+phien.id+"' AND `cuoc` = 'tai'",function(err, cuoc){
                        try 
                        {
                            if(cuoc.length >=1)
                            {
                                res(cuoc[0].tiencuoc);
                            }
                            else 
                            {
                                res(0);
                            }
                        }
                        catch(e)
                        {
                            res(0)
                        }
                    })
                }
                ),
                new Promise(
                    (res,fai) =>{
                         mysqli.query("SELECT SUM(vangcuoc) as tiencuoc FROM `cuoc` WHERE `phien` =  '"+phien.id+"' AND `cuoc` = 'xiu'",function(err, cuoc){
                            try{
                                if(cuoc.length >=1)
                                {
                                    res(cuoc[0].tiencuoc);
                                }
                                else 
                                {
                                    res(0);
                                   
                                }
                            }
                            catch(e)
                            {
                                res(0)
                            }
                    })
                }
                ),
            ]).then(d => {
                let chan = d[0];
                let le = d[1];
                let tai = d[2];
                let xiu = d[3];
                client.dn({
                    loading : -1,
                    loadserver : 
                    {
                        chan: chan,
                        ketqua : phien.ketqua,
                        id: phien.id,
                        le: le,
                        server: phien.server,
                        tai: tai,
                        time: 0,
                        xiu: xiu,
                    }
                });
            })
                
        } 
            
        
    });
}

let cuoc  = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg  : 'B???n ch??a ????ng nh???p',
            type : 'info',
            loading : -1,
        })
    }
    else 
    if(client.csmm ==1)
    {
        client.dn({
            msg  : '???? c?? m???t y??u c???u tr?????c ????, vui l??ng ch??? x??? l??.',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        client.csmm = 1;
        let cuoc = checkstring.html(data.cuoc);
        let game = checkstring.html(data.type);
        let vang = checkstring.int(data.vang);
        let vutru = data.server >> 0;
        if(vang <2000000 || vang > 1000000000)
        {
            client.dn({
                msg  : 'Xu c?????c t???i ??a l?? t??? 2.000.000 - 1.000.000.000 xu',
                type : 'info',
                loading : -1,
            })
            client.csmm = 0;
        }
        else 
        {
            mysqli.query("SELECT  * FROM `phien` WHERE `server` = '"+vutru+"' AND `status` = '0' LIMIT 1",function(err,phien){
                try{
                    if(phien.length >=1)
                    {
                        phien = phien[0];
                        if(phien.time < 20)
                        {
                            client.dn({
                                msg : '???? qu?? th???i gian cho ph??p c?????c, b???n vui l??ng ch??? t???i phi??n sau nh??.',
                                type : 'info',
                                loading : -1,
                            })
                            client.csmm = 0;
                        }
                        else 
                        {
                            mysqli.query("SELECT `xu`, `name`, `server` FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err2,users){
                                try 
                                {
                                    if(users.length <=0)
                                    {
                                        client.dn({
                                            msg : 'Kh??ng th??? t??m th???y t??n nh??n v???t c???a b???n, h??y th??? ????ng nh???p l???i',
                                            type : 'info',
                                            loading : -1,
                                        })
                                        client.csmm = 0;
                                    }
                                    else 
                                    {
                                        users = users[0];
                                        if(users.xu < vang) 
                                        {
                                            client.dn({
                                                msg : 'T??i kho???n c???a b???n ch??? c??  '+checkstring.number_format(users.xu)+' Xu. H??y n???p th??m ????? ch??i',
                                                type : 'warn',
                                                loading : -1,
                                            })
                                            client.csmm = 0;
                                        }
                                
                                        
                                        else 
                                        {
                                            mysqli.query("INSERT INTO `cuoc` SET `uid` = '"+client.id+"', `name` = '"+users.name+"', `server` = '"+phien.server+"', `game` = '"+game+"', `vangcuoc` = '"+vang+"', `cuoc` = '"+cuoc+"', `phien` = '"+phien.id+"', `trangthai` = '0', `thoigian` = '"+checkstring.time().thoigian+"'",function(err3,insert){
                                                try {
                                                    sodu(client.id,users.xu,-vang,'C?????c '+(game == "taixiu" ? 'T??i x???u' : 'Ch???n l???')+'','cuoc',insert.insertId);
                                                    client.dn({
                                                        vang : users.xu - vang,
                                                        msg : '?????t c?????c th??nh c??ng ! Ch??c b???n may m???n.',
                                                        type : 'success',
                                                        loading : -1,
                                                        newcuoc : true,
                                                    });
                                                    if (vang >= 30000000) {
                                                        let cut = function(x)
                                                        {
                                                            if(x == "chan")  return "ch???n";
                                                            if(x == "le")  return "L???";
                                                            if(x == "tai")  return "t??i";
                                                            if(x == "xiu")  return "xiu";
                                                            if(x == "chantai")  return "ch???n - t??i";
                                                            if(x == "chanxiu")  return "ch???n - x???u";
                                                            if(x == "letai")  return "l??? - t??i";
                                                            if(x == "lexiu")  return "l??? - x???u";
                                                        }
                                                        let noidung = 'CSMM V?? tr???.' + phien.server + ': <b>' + users.name + '</b> v???a c?????c l???n <b>' + checkstring.number_format(vang) + '</b> xu v??o c???a ' + cut(cuoc) + '</b>.';
                                                        mysqli.query("INSERT INTO `chat` SET `thoigian` = '" + Date.now() + "', `noidung` = '" + noidung + "', `uid` = '1'", function (er, g) {
                                                            io.all(
                                                                {
                                                                    chatbox:
                                                                    {
                                                                        name: 'H??? th???ng',
                                                                        avatar: '/vendor/avatar/avatar.png',
                                                                        msg: noidung
                                                                    }
                                                                },
            
                                                            );
            
                                                        });
                                                    }
            
                                                    /* Insert log */
                                                    gamecuoc.push({
                                                        id : insert.insertId,
                                                        phien : phien.id,
                                                        server : phien.server,
                                                        game : game,
                                                        chan : cuoc == "chan" ? vang : 0,
                                                        le : cuoc == "le" ? vang : 0,
                                                        tai : cuoc == "tai" ? vang : 0,
                                                        xiu : cuoc == "xiu" ? vang : 0,
                                                        chantai : cuoc == "chantai" ? vang : 0,
                                                        chanxiu : cuoc == "chanxiu" ? vang : 0,
                                                        letai : cuoc == "letai" ? vang : 0,
                                                        lexiu : cuoc == "lexiu" ? vang : 0,
                                                        name : users.name,
                                                        vangcuoc : vang,
                                                        cuoc : cuoc,
                                                        uid : client.id,
                                                    })
                                                    client.csmm = 0;
                                                    mysqli.query("SELECT * FROM cuoc ORDER by `id` DESC LIMIT 200",function(err,logc){
                                                        let array = [];
                                                        logc.forEach(obj => {
                                                            array.push({
                                                                id : obj.id,
                                                                uid : obj.uid,
                                                                name : obj.name,
                                                                phien : obj.phien,
                                                                server : obj.server,
                                                                game : obj.game,
                                                                vangcuoc : obj.vangcuoc,
                                                                vangnhan : obj.vangnhan,
                                                                cuoc : obj.cuoc,
                                                                trangthai : obj.trangthai,
                                                                thoigian : checkstring.thoigian(obj.thoigian),
                                                            });
                                                        });
                                                        io.all({
                                                            logcuoc : array
                                                        })
                                                        
                                                    })
                                                }
                                                catch(e)
                                                {
                                                    console.log(e)
                                                }
                                                
                                            })
                                        }
                                    }
                                }       
                                catch(e)
                                {
                                    console.log(e)
                                }                         
                            })
                        }
                    }
                    else 
                    {
                        client.dn({
                            msg : 'Kh??ng th??? t??m th???y phi??n c???a V?? tr??? n??y, c?? th??? v?? tr??? ??ang b???o tr??, b???n h??y th??? ch???n v?? tr??? kh??c nh??.',
                            type : 'info',
                            loading : -1,
                        })
                        client.csmm = 0;
                    }
                }
                catch(e)
                {
                    console.log(e)
                }
            })
        }
    }
}

let getphien = function(client, data)
{
    let server = data.server >> 0;
    Promise.all([new Promise((res,fai) => {
        mysqli.query("SELECT * FROM `phien` WHERE `server` = '"+server+"' AND `status` = '1' ORDER BY `id` DESC LIMIT 10",function(err,phien) {
            try 
            {
                let array = [];
                phien.forEach(e => {
                    array.push({
                        id : e.id,
                        thoigian : checkstring.thoigian(e.thoigian),
                        status : 1,
                        ketqua : e.ketqua,
                    })
                });
                res(array)
            }
            catch(e)
            {
                res([])
            }
        })
    }), new Promise((res,fai)=> {
        mysqli.query("SELECT * FROM `phien` WHERE `server` = '"+server+"' AND `status` = '1' ORDER BY `id` DESC LIMIT 1",function(err,phien){
            try 
            {
                let kq = 0;
                phien.forEach(e => {
                    kq = e.ketqua;
                });
                res(kq);
            }
            catch(e)
            {
                res([])
            }
        })
    })]).then(e => {
        let list = e[0];
        client.dn({
            getphien : {
                list : list,
                pre : e[1]
            },
            loading : -1,
        })
    }) 
}


let phiendangcuoc = function(client)
{
    mysqli.query("SELECT * FROM cuoc ORDER by `id` DESC LIMIT 200",function(err,logc){
        let array = [];
        logc.forEach(obj => {
            array.push({
                id : obj.id,
                uid : obj.uid,
                name : obj.name,
                phien : obj.phien,
                server : obj.server,
                game : obj.game,
                vangcuoc : obj.vangcuoc,
                vangnhan : obj.vangnhan,
                cuoc : obj.cuoc,
                trangthai : obj.trangthai,
                thoigian : checkstring.thoigian(obj.thoigian),
            });
        });
        client.dn({
            logcuoc : array
        })
        
    })
}


module.exports = function(client,data)
{
    if(!!data.getlsgs)
    {
        phiendangcuoc(client);
    }
    if(!!data.phien)
    {
        getphien(client,data.phien);
    }
    if(!!data.get)
    {
        server(client,data.get);
    }
    if(!!data.cuoc)
    {
        cuoc(client,data.cuoc)
    }
} 