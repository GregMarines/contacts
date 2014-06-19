var ListView = function(el){
    this.el = $(el);
};

ListView.prototype.refreshList = function(items){
    this.el.html('');
    this.el.hide();
    this.addItems(items);
    this.el.fadeIn('slow');
};

ListView.prototype.addItems = function(items) {
	var count = 0;
    $.each(items,$.proxy(function(i,item){
        this.addItem(item,count);
		count++;
    },this));
};

ListView.prototype.addItem = function(item,count){
	this.el.append($("<li/>").html("<a href='details.html?id="+count+"' data-transition='slide' class='listemployees'>" + item.FIRSTNAME + " " + item.LASTNAME + " Count" + count + "</a>"));
};

$(document).on("pageshow", "#page2", function( event ) {
	
	/* NOT FIRING
	if ( !navigator.userAgent.match(/(iPhone|Android)/) ) {
		$('a.phonelink').click(function(e){
		alert ("Phone link is prevented from working since this is not a smartphone");
			e.preventDefault();
		});
	}
	*/
	// [MINE 30 need to pass in the number
	function getOneContactFromLocalStorage(employee){
		var employees = JSON.parse(localStorage.getItem("contacts"))
		return employees[employee];
	} 

	var param = $(this).data("url").split("?")[1];;
	param = param.replace("id=","");
	var empl = getOneContactFromLocalStorage(param);
	console.log(empl.PHONE);
	var html ='';
 	html += '<li>' + empl.ID+ '</li>';	
	html += '<li>' + empl.FIRSTNAME+ '</li>';
	html += '<li>' + empl.LASTNAME+ '</li>';
	html += '<li>' + empl.TITLE+ '</li>';	
    html += '<li><a class="phonelink" href="tel:'+empl.PHONE+'" data-role="button" rel="external">' + empl.PHONE+ '</a></li>';
    $('#contactdetail').html('');
	$('#contactdetail').append($(html));
    $('#contactdetail').trigger('create');    
    $('#contactdetail').listview('refresh');
});	

var App = (function(){
    var db = localStorage;

    function initialize() {	
        studiosListView = new ListView(".main ul");
        bindEvents();
		
		
		if(typeof check !== 'undefined' || check  !== null){
			alert("have");

		}else{
			alert("empty");
			App.sync();
		}			
		
		
		
        populateStudiosList(getStudiosFromLocalStorage());

        this.getStudios = getStudiosFromLocalStorage;
        this.sync = sync;
        this.clear = clear;

		var check = JSON.parse(localStorage.getItem("contacts"))
		
	/*
		if(typeof check !== 'undefined' || check  !== null){
			alert("have");
			populateStudiosList(getStudiosFromLocalStorage());
		}else{
			alert("empty");
			App.sync();
		}		
	
		if(check != null && check.length){
			alert("have");
			populateStudiosList(getStudiosFromLocalStorage());
		}else{
			alert("empty");
			App.sync();
		}
		*/

	}

    function bindEvents() {
        $("a#sync").on('click',sync);
        $("a#clear").on('click',clear);
    }

    function populateStudiosList(contacts) {
        studiosListView.refreshList(contacts);
		// jquery mobile needs to reload css
		$('#contactlist').listview('refresh');
    }
    
    function getStudiosFromLocalStorage() {
        return JSON.parse(db.getItem("contacts")) || [];
    }

    function clear() {
        resetLocalStorage();
        populateStudiosList(getStudiosFromLocalStorage());
    }

    function sync() {
		//var url = "http://www.laudisi.com/retjson/test1.cfm"
		//var url = "http://localhost:8500/snippits/scrap/test2.cfm"
		var url = "http://www.smokingpipes.com/test/test2.cfm"		
        $.getJSON(url, function(contacts){
            storeStudiosInLocalStorage(contacts);
            populateStudiosList(contacts);
        });
    }

    function resetLocalStorage() {
        db.setItem("contacts", JSON.stringify({ contacts: [] }));
    }

    function storeStudiosInLocalStorage(contacts) {
     db.setItem("contacts", JSON.stringify(contacts));
    };

    return {
        initialize: initialize
    }
})();