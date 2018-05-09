import $ from 'jquery';
import Rx from 'rxjs/Rx';

const btn = $("#btnMe");

//Create Observable from Event
const btnStream$ = Rx.Observable.fromEvent(btn, 'click');

btnStream$.subscribe((e) => {
    console.log(e.target.innerHTML);
}, (err) => {
    console.log(err);
}, () => {
    console.log("Completed");
});

//Create Observable from Array
const list = [{ title: "One", body: "Hello this is shamal" }, { title: "Two", body: "Hello this is Menuka" },
{ title: "Three", body: "Hello this is Fernando" }];

const listStream$ = Rx.Observable.from(list);

listStream$.subscribe((post) => {
    $("#myList").append('<li><h3>' + post.title + '</h3>' + post.body + '</li>');
}, (err) => {
    console.log(err);
}, () => {
    console.log("Completed");
});

//Create new Observable from scratch

const source$ = new Rx.Observable(observer => {
    observer.next("new Value");

    setTimeout(() => {
        observer.next("yet another value");
        observer.complete();
    }, 2000)
});

source$.subscribe(x => {
    console.log(x);
}, err => {
    console.log(err);
}, () => {
    console.log("Stream Completed.")
});

//Create observable from promise

function getuser(username) {
    return $.ajax({
        url: 'http://api.github.com/users/' + username,
        dataType: 'jsonp'
    }).promise();
}

//using double subscribe this is not good programing practice.
// Rx.Observable.fromEvent($('#txtName'), 'keyup').subscribe(
//     e => {
//         Rx.Observable.fromPromise(getuser(e.target.value)).
//             subscribe(data => {
//                 $('#userDetails >li').remove();
//                 $('#userDetails').append('<li><h4>User Name: ' + data.data.name + '</h4></li>');
//                 $('#userDetails').append('<li><h4>No of Public Repos: ' + data.data.public_repos + '</h4></li>');
//             }, err => {
//                 console.log(err);
//             }, () => {
//                 console.log('Complete Operation');
//             });
//     });

//replace double subscribe with switchMap
Rx.Observable.fromEvent($('#txtName'), 'keyup').map(e=>e.target.value)
            .switchMap(v=>{
                //return is important
                return Rx.Observable.fromPromise(getuser(v))
            })
            .subscribe(data => {
                $('#userDetails >li').remove();
                $('#userDetails').append('<li><h4>User Name: ' + data.data.name + '</h4></li>');
                $('#userDetails').append('<li><h4>No of Public Repos: ' + data.data.public_repos + '</h4></li>');
            });;


//Some operations (take,map,merge,concaternate)
Rx.Observable.interval(1000).take(10).map(x=>x*2).
        subscribe(x=>console.log(x));

Rx.Observable.from(["Shamal","Achi","fernando"]).map(x=>x.toUpperCase()).
        subscribe(x=>console.log(x));

const source1$=Rx.Observable.interval(2000).map(x=>'Merge 1 '+x);
const source2$=Rx.Observable.interval(500).map(x=>'Merge 2 '+x);

//merge: both stream will be emitted same time.
Rx.Observable.merge(source1$,source2$).take(5).
            subscribe(x=> console.log(x));

//concate: one after other value get emitted.            
const source3$=Rx.Observable.range(0,5).map(x=>'Source 1 '+x);
const source4$=Rx.Observable.range(6,5).map(x=>'Source 2 '+x);

Rx.Observable.merge(source3$,source4$).
            subscribe(x=> console.log(x));            



