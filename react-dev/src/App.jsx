import './App.css';
import Card from './components/Card';
import {useEffect, useState} from 'react';
import CategoryForm from './components/CategoryForm';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

function App() {
    let username = cookie.get('username')
    let data = []
    var objToday = new Date(),
            weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
            dayOfWeek = weekday[objToday.getDay()],
            domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
            dayOfMonth = ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
            months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
            curMonth = months[objToday.getMonth()],
            curYear = objToday.getFullYear()
    let [date, setDate] = useState(dayOfWeek + ', ' + dayOfMonth + ' ' + curMonth + ', ' + curYear)
    useEffect(() => {
        fetch('/data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username})
        }).then((res) => {
            res.json().then((json) => {data = json; console.log(json)}).then(() => {
                setLinks(data);
            });
        })
    }, [])
    let [isClick, setClick] = useState(false);
    let [links, setLinks] = useState(data);

    function onClick() {
        setClick(true)
    }

    function cancel() {
        setClick(false)
    }

    function submit(title) {
        setLinks(prev => {
            fetch('/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, data: [...prev, {title: title, links: []}]})
            }).then((res) => {
                console.log('req sent')
            })
            return [...prev, {title: title, links: []}]
        })
    }

    function update(link, title) {
        setLinks(prev => {
            let arr = prev;
            arr.forEach(category => {
                if (category.title == title) {
                    category.links.push(link);
                }
            })

            fetch('/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, data: [...arr]})
            }).then((res) => {
                console.log('req sent')
            })

            return [...arr];
       
       })
    }

    function change() {
        var objToday = new Date(),
            weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
            dayOfWeek = weekday[objToday.getDay()],
            domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
            dayOfMonth = ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
            months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
            curMonth = months[objToday.getMonth()],
            curYear = objToday.getFullYear(),
            curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
            curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
            curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
            curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
        
        var day = (dayOfWeek + ', ' + dayOfMonth + ' ' + curMonth + ', ' + curYear);
        setDate(day)
    }

    setInterval(change, 5000)

    return (
        <>
            <h1 style={{fontSize: '40px', textAlign: 'center', display: 'block', float: 'center'}}>Bookmarks</h1>
            <h3 style={{fontSize: '25px', position: 'fixed', bottom: '15px', right: '10px'}}>{date}</h3>
            {links.map(link => {
                return <Card links={link.links} header={link.title} update={update}/>
            })}
            {!isClick ? <button class="add-category" onClick={onClick}>Add Category</button> : <CategoryForm cancel={cancel} submit={submit} />}
        </>
    )
}

export default App;