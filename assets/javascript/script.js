$(document).ready(()=>{
    // get course key from url
    let search = window.location.search.substring(1)
    console.log(search)
    let urlsp = new URLSearchParams(search)
    let courseKey = urlsp.get('course')
    console.log(courseKey)

    // get time from database and render on page
    let courseID = 'courseID_'+courseKey
    db.ref('course').child(courseID).get().then((snapshot)=>{
        let courseName = snapshot.val().courseName
        $('#courseName').text(courseName)
        let timeOptions = snapshot.val().timeOptions
        timeOptions.forEach((timeOption)=>{
            let dayOption = timeOption.split('_')[0]
            let hourOption = timeOption.split('_')[1]
            let $timeOption = `<div><input type="checkbox" value=${timeOption} class="timeItem" checked><span>  ${dayTime[dayOption]} ${hourTime[hourOption]}</span></div>`
            // console.log($timeOption.find(".timeItem"))
            $('.timeList').append($timeOption)
        })
    })
    
    $('#submitCourse').on('click', ()=>{
        $('#firstName').removeClass("warningBorder")
        $('#lastName').removeClass("warningBorder")
        $('#firstNameMessage').css('display', 'none')
        $('#lastNameMessage').css('display', 'none')
        // validation
        let regex =/^[a-zA-Z]+$/
        let firstName = $('#firstName').val()
        let lastName = $('#lastName').val()
        if(firstName==''){
            $('#firstName').addClass("warningBorder")
        }else if(lastName==''){
            $('#lastName').addClass("warningBorder")
        }else if(!regex.test(firstName)){
            $('#firstName').addClass("warningBorder")
            $('#firstNameMessage').css('display', 'block')
        }else if(!regex.test(lastName)){
            $('#lastName').addClass("warningBorder")
            $('#lastNameMessage').css('display', 'block')
        }else{
            // get time options
            let timeSetting = []
            $('.timeItem').each(function(){
                if($(this).is(":checked")){
                    timeSetting.push($(this).val())
                }
            })
            // save time options into database
            let key = 'enroll_'+getRandomKey()
            let enrollInfor = {}
            enrollInfor.firstName=firstName
            enrollInfor.lastName=lastName
            enrollInfor.courseID=courseID
            enrollInfor.timeOptions= timeSetting
            db.ref('enroll').child(key).set(enrollInfor).then(()=>{
                window.location.href='thankyou.html'
            })
        }
    })
})
const getRandomKey = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 28;
    let randomStr = "";
    for (let i = 0; i < length; i++) {
      const randomNum = Math.floor(Math.random() * characters.length);
      randomStr += characters[randomNum];
    }
    return randomStr;
  };