var dataArray=[];
var all_map;
var beforeSize;
var addInt;

function init(){
    firebase_init();
    setEvent();
}

function setEvent(){
    //modal
    $('#table_info_Modal').on('show.bs.modal', function (event) {
        
        var row = $(event.relatedTarget);
        var index = row.data('index');
        var target = dataArray[index];
        console.log('array : ' + dataArray.length);
        var m_image = $('#modal_image');
        var m_user = $('#modal_user');
        var m_party = $('#modal_party');
        var m_field = $('#modal_field');
        var m_date = $('#modal_date');
        var m_content = $('#modal_content');

        m_user.text(target.uName);
        m_image.attr('src', target.uImageUrl);
        m_party.text(target.uRank);
        m_field.text(target.uField);
        m_date.text(target.uUploadDate);

        if(target.uContext.length < 1){
            m_content.text("제보 내용이 없습니다.");
        }else{
            m_content.text(target.uContext);
        }

        var point = new google.maps.LatLng(target.lat, target.lon);
        all_map.panTo(point);
        all_map.setZoom(20);
    });

    //now_progress
    $('#now_progress').on('click', function(event){
        
    });

    //flag_bar
    $('#flag_bar').on('click', function(event){
        var target_1 = $('#flag_bar > a > i.fa-bell');
        target_1.attr('style', 'color:#2e6da4;');
        var target_3 = $('#flag_bar > a > span.badge');
        target_3.text('');
    });
}

function firebase_init(){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDJn-l0na0j2OKYLiyfnizalBy785XoL8A",
        authDomain: "storagefirebase-45eef.firebaseapp.com",
        databaseURL: "https://storagefirebase-45eef.firebaseio.com",
        projectId: "storagefirebase-45eef",
        storageBucket: "storagefirebase-45eef.appspot.com",
        messagingSenderId: "667190904245"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    database.ref('service').on('value', function(snapshop){
        if(snapshop.val() == null){
            alert('Database null... Firebase Check');
        }else{
            var table = document.getElementById('datas');
            var paging = document.getElementsByClassName('pagination');
            table.innerHTML = "";
            paging[0].innerHTML = "";
            dataArray = [];

            snapshop.forEach(function(child, index){
                var item = new Object();
                item.lat =  child.val().lat;
                item.lon = child.val().lon;
                item.uAddress = child.val().uAddress;
                item.uContext = child.val().uContext;
                item.uField = child.val().uField;
                item.uImageUrl = child.val().uImageUrl;
                item.uName = child.val().uName;
                item.uRank = child.val().uRank;
                item.uUploadDate = child.val().uUploadDate;
                item.uid = child.val().uid;

                dataArray.push(item);
                addRow('datas', item);
            });
            
            initMap(dataArray);
            pagination();
            setBoard(dataArray);
            
            console.log('1. dataArray.length : ' +  dataArray.length);
            console.log('1. beforeSize : ' + beforeSize);
            console.log('1. addInt : ' + addInt);
            addInt = dataArray.length - beforeSize;

            if(beforeSize != null){
                addFlag();
            }

            beforeSize = dataArray.length;

            console.log('2. dataArray.length : ' +  dataArray.length);
            console.log('2. beforeSize : ' + beforeSize);
            console.log('2. addInt : ' + addInt);

            
        }
    });
}

function addFlag(){
    var target_1 = $('#flag_bar > a > i.fa-bell');
    target_1.attr('style', 'color:red;');
    var target_3 = $('#flag_bar > a > span.badge');

    var beforeInt = target_3.text();
    console.log('beforeInt : ' + beforeInt);
    if(beforeInt == null || beforeInt==''){
        beforeInt = 0;
    }
    var nowInt = addInt + parseInt(beforeInt);

    target_3.text(nowInt);

    console.log('nowInt : ' + nowInt);
}

function addRow(tableid, target) {
    
    var table = document.getElementById(tableid);
    var rowlen = table.rows.length;
    var before = table.innerHTML;
    var after = '<tr class="table_row" data-toggle="modal" data-target="#table_info_Modal" data-index="'+rowlen+
                '">'+'<td>'+(rowlen+1)+'</td>'+
                '<td>'+target.uRank+'</td>'+
                '<td>'+target.uName+'</td>'+
                '<td>'+target.uUploadDate+'</td>'+
                '<td>'+target.uField+'</td>'+
                '<td>'+'<img class="imgs" src="'+target.uImageUrl+'" />'+'</td></tr>';

    table.innerHTML = after+before;
}

function setBoard(array){
    var board_text = document.getElementsByClassName('board_text');
    var board_count = document.getElementsByClassName('board_count');
    var board_count_1 = board_count[0];
    var board_count_2 = board_count[1];
    var board_count_3 = board_count[2];
    var board_count_4 = board_count[3];
    var board_count_5 = board_count[4];
    var board_count_6 = board_count[5];
    //aria-valuenow="40" aria-valuemin="0" aria-valuemax="1000"

    var count_field_1 = 0, count_field_2 = 0, count_field_3 = 0
        , count_field_4 = 0, count_field_5 = 0, count_field_6 = 0;
    var max = 0;
    array.forEach(function(value, index){
        if(value.uField.replace(/ /gi, "").match('기타')){
            count_field_6++;
            if(max < count_field_6){
                max = count_field_6;
            }
        }else if(value.uField.replace(/ /gi, "").match('환경')){
            count_field_5++;
            if(max < count_field_5){
                max = count_field_5;
            }
        }else if(value.uField.replace(/ /gi, "").match('보수요청')){
            count_field_4++;
            if(max < count_field_4){
                max = count_field_4;
            }
        }else if(value.uField.replace(/ /gi, "").match('신규')){
            count_field_3++;
            if(max < count_field_3){
                max = count_field_3;
            }
        }else if(value.uField.replace(/ /gi, "").match('주차')){
            count_field_2++;
            if(max < count_field_2){
                max = count_field_2;
            }
        }else if(value.uField.replace(/ /gi, "").match('안전')){
            count_field_1++;
            if(max < count_field_1){
                max = count_field_1;
            }
        }
    });

    var max_length = max.toString().length;
    var init_maxlength = 2;
    if (max_length < init_maxlength){
        max_length = init_maxlength;
    } 

    var length = '1';
    for(var j = 0 ; j<max_length;j++){
        length+='0';
    }

    max_length = parseInt(length);
    board_count_1.setAttribute('aria-valuenow', count_field_1);
    board_count_1.setAttribute('style', 'width:'+count_field_1+'%;');
    board_count_1.setAttribute('aria-valuemax', max_length);
    board_text[0].innerHTML = count_field_1+' 건';
    board_count_2.setAttribute('aria-valuenow', count_field_2);
    board_count_2.setAttribute('style', 'width:'+count_field_2+'%;');
    board_count_2.setAttribute('aria-valuemax', max_length);
    board_text[1].innerHTML = count_field_2+' 건';
    board_count_3.setAttribute('aria-valuenow', count_field_3);
    board_count_3.setAttribute('style', 'width:'+count_field_3+'%;');
    board_count_3.setAttribute('aria-valuemax', max_length);
    board_text[2].innerHTML = count_field_3+' 건';
    board_count_4.setAttribute('aria-valuenow', count_field_4);
    board_count_4.setAttribute('style', 'width:'+count_field_4+'%;');
    board_count_4.setAttribute('aria-valuemax', max_length);
    board_text[3].innerHTML = count_field_4+' 건';
    board_count_5.setAttribute('aria-valuenow', count_field_5);
    board_count_5.setAttribute('style', 'width:'+count_field_5+'%;');
    board_count_5.setAttribute('aria-valuemax', max_length);
    board_text[4].innerHTML = count_field_5+' 건';
    board_count_6.setAttribute('aria-valuenow', count_field_6);
    board_count_6.setAttribute('style', 'width:'+count_field_6+'%;');
    board_count_6.setAttribute('aria-valuemax', max_length);
    board_text[5].innerHTML = count_field_6+' 건';
}


function initMap(locations) {
    var markers=[];
    var kor = {lat: 37.335887, lng: 126.584063};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: kor
    });
    var iconBase = 'assets/images/';
    var icons = {
        safe_danger: {
            url: iconBase + 'safe_danger_marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor : new google.maps.Point(17, 34),
            scale : new google.maps.Size(40, 40)
        },
        green: {
            url: iconBase + 'green_marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor : new google.maps.Point(17, 34),
            scale : new google.maps.Size(40, 40)
        },
        new: {
            url: iconBase + 'new_marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor : new google.maps.Point(17, 34),
            scale : new google.maps.Size(40, 40)
        },
        parking: {
            url: iconBase + 'parking_marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor : new google.maps.Point(17, 34),
            scale : new google.maps.Size(40, 40)
        },
        req: {
            url: iconBase + 'req_marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor : new google.maps.Point(17, 34),
            scale : new google.maps.Size(40, 40)
        },
        etc: {
            url: iconBase + 'etc_marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor : new google.maps.Point(17, 34),
            scale : new google.maps.Size(40, 40)
        }
    };

    if(locations.length <1){
        var marker = new google.maps.Marker({
            position: kor,
            map: map
        });
    }else{
        locations.forEach(function(item, i){

            if(i==0){
                map.setZoom(13);
                var point = new google.maps.LatLng(item.lat, item.lon);
                map.panTo(point);
            }

            var image = '';
            if(item.uField.replace(/ /gi, "").match('기타')){
                image = icons.etc;
            }else if(item.uField.replace(/ /gi, "").match('환경')){
                image = icons.green;
            }else if(item.uField.replace(/ /gi, "").match('보수요청')){
                image = icons.req;
            }else if(item.uField.replace(/ /gi, "").match('신규')){
                image = icons.new;
            }else if(item.uField.replace(/ /gi, "").match('주차')){
                image = icons.parking;
            }else if(item.uField.replace(/ /gi, "").match('안전')){
                image = icons.safe_danger;
            }

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.lat, item.lon),
                icon: {
                    url : image.url,
                    size : image.size,
                    origin : image.origin,
                    anchor : image.anchor,
                    scaledSize : image.scale
                },
                title : i+'. '+item.uField

            });

            var contentString = 
            '<div>' +
            '<div class="col-sm-12"> ' +
            '<div class="col-sm-7"> ' +
            '<img id="modal_image" src="'+item.uImageUrl+'" style="width:200px;"/>' +
            '</div>'+
            '<div class="col-sm-5">'+
            '<form>'+
            '<div class="form-group" style="margin-bottom:5px;">'+
            '<label for="recipient-name" class="control-label">제보자 :</label>'+
            '<h7 id="modal_user" style="text-align:center;"> '+item.uName+'</h7>'+
            '</div>'+
            '<div class="form-group" style="margin-bottom:5px;">'+
            '<label for="message-text" class="control-label">소  속:</label>'+
            '<h7 id="modal_party" style="text-align:center;"> '+item.uRank+'</h7>'+
            '</div>'+
            '<div class="form-group" style="margin-bottom:5px;">'+
            '<label for="message-text" class="control-label">제보일:</label>'+
            '<p id="modal_date" style="text-align:center;"> '+item.uUploadDate+'</p>'+
            '</div>'+
            '<div class="form-group" style="margin-bottom:5px;">'+
            '<label for="message-text" class="control-label">분  야:</label>'+
            '<h7 id="modal_field" style="text-align:center;"> '+item.uField+'</h7>'+
            '</div>'+
            '<div class="form-group" style="margin-bottom:5px;">'+
            '<label for="message-text" class="control-label">제보내용:</label>'+
            '<p id="modal_content" style="text-align:center;"> '+item.uContext+'</p>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', function() {
                map.setZoom(20);
                var point = new google.maps.LatLng(item.lat, item.lon);
                map.panTo(point);

                infowindow.open(map, marker);
            });
            markers.push(marker);
        });
        all_map = map;
        var markerCluster = null;
        var markerCluster = new MarkerClusterer(all_map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        }
        
    }

    //Table Pager...........
    function pagination(){
        var req_num_row=6;
        var $tr=jQuery('#datas tr');
        var total_num_row=$tr.length;
        var num_pages=0;
        if(total_num_row % req_num_row ==0){
            num_pages=total_num_row / req_num_row;
        }
        if(total_num_row % req_num_row >=1){
            num_pages=total_num_row / req_num_row;
            num_pages++;
            num_pages=Math.floor(num_pages++);
        }
        for(var i=1; i<=num_pages; i++){
            jQuery('.pagination').append('<li><a href="#">'+i+'</a></li>');
        }
        $tr.each(function(i){
            jQuery(this).hide();
            if(i+1 <= req_num_row){
                $tr.eq(i).show();
            }
        
        });
        jQuery('.pagination a').click(function(e){
            e.preventDefault();
            $tr.hide();
            var page=jQuery(this).text();
            var temp=page-1;
            var start=temp*req_num_row;
            //alert(start);
            
            for(var i=0; i< req_num_row; i++){
                
                $tr.eq(start+i).show();
            
            }
        });
    }

    //search Function
    function tableFilter() {
        // Declare variables 
        var input, filter, table, paging;
        input = document.getElementById("input_table_filter");
        filter = input.value.toUpperCase().replace(/ /gi, "");
        table = document.getElementById('datas');
        paging = document.getElementsByClassName('pagination');

        if(filter){
            table.innerHTML = "";
            for(var i = 0 ; i< dataArray.length;i++){
                var row = dataArray[i];
                if(row.uField.toUpperCase().replace(/ /gi, "").includes(filter) ||
                    row.uRank.toUpperCase().replace(/ /gi, "").includes(filter) ||
                    row.uName.toUpperCase().replace(/ /gi, "").includes(filter) ||
                    row.uUploadDate.toUpperCase().replace(/ /gi, "").includes(filter)){
                   
                    addRow('datas', row);
                }
            }

            paging[0].innerHTML = "";
            pagination();
        }else{
            table.innerHTML = "";
            for(var i = 0 ; i< dataArray.length;i++){
                addRow('datas', dataArray[i]);
            }
            paging[0].innerHTML = "";
            pagination();
        }
        
    }