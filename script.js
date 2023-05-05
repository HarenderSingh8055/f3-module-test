const ipAddress = document.querySelector("#ipAddress");
const getDataBtn = document.querySelector("#getDataBtn");
const mainContentWrapper = document.querySelector(".main-content-wrapper");
const mapWrapper = document.querySelector(".map-wrapper");
const postalWrapper = document.querySelector(".postal-wrapper");
const cardWrapper = document.querySelector(".card-wrapper");

let ip;
let ipData;
let postData;
let postOffices;

//************* GETTING THE IP ADDRESS ***********//
fetch("https://api.ipify.org?format=json")
  .then((resp) => resp.json())
  .then((data) => {
    ip = data.ip;
    ipAddress.innerText = ip;
});



//************* SHOWING THE DATA ON BUTTON CLICK ***********//
getDataBtn.addEventListener("click",()=>{

    //************* FETCHING THE DATA ON IP ***********//
    fetch(`https://ipinfo.io/${ip}?token=1641f579c8c94f`)
    .then((res)=>res.json()
    )
    .then((data)=>{
        getDataBtn.style.display = "none";
        ipData = data;
        mainContentWrapper.style.display = "block";
        let location = ipData.loc.split(",");
        let lat = location[0];
        let long = location[1];


        mapWrapper.innerHTML = `
        <div class="map-content">
            <p>Lat : <span>${lat}</span></p>
            <p>City : <span>${ipData.city}</span></p>
            <p>Organisation : <span>${ipData.org}</span></p>
            <p>Long : <span>${long}</span></p>
            <p>Region : <span>${ipData.region}</span></p>
            <p>Hostname : <span>${ipData.hostname}</span></p>
        </div>
        <div class="map">
            <iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" width="360" height="270" frameborder="0" style="border:0"></iframe>
        </div>`

        getTimeZone();

    })
})


//************* GETTING THE DSTE AND TIME ***********//
function getTimeZone(){
    let userTime = new Date().toLocaleString("en-US", { timeZone: `${ipData.timezone}` });


    //************* FETCHING THE POST OFFICES ***********//
    fetch(`https://api.postalpincode.in/pincode/${ipData.postal}`)
    .then((res)=>res.json())
    .then((data)=>{
        // console.log(data);
        postData = data;
        postOffices = postData[0].PostOffice;
        console.log(postOffices)

        postalWrapper.innerHTML = `
            <p>Time Zone : <span>${ipData.timezone}</span></p>
            <p>Date And Time : <span>${userTime}</span></p>
            <p>Pincode : <span>${ipData.postal}</span></p>
            <p>Message : <span>${postData[0].Message}</span></p>
            <div class="filter-wrapper">
                <input type="text" placeholder="Filter" oninput="search(this)" id="filterSearch">
            </div>`;

            showOffices(postOffices);
    })
}


//************* SHOWING THE POST OFFICES ***********//
function showOffices(postOffices){
    cardWrapper.innerHTML = "";
    postOffices.map((item)=>{
        cardWrapper.innerHTML += `
            <div class="card">
                <p>Name : <span>${item.Name}</span></p>
                <p>Branch Type : <span>${item.BranchType}</span></p>
                <p>Delivery Status : <span>${item.DeliveryStatus}</span></p>
                <p>District : <span>${item.District}</span></p>
                <p>Division : <span>${item.Division}</span></p>
            </div>`;
    })

}


//************* SPOST OFFICES BASES ON FILTER ***********//
function search(e){
    let word = e.value.toLowerCase().trim();
    // console.log("my search",e.value);
    // console.log(postOffices)

    let alloffices = postOffices.filter((item)=>{
        if(item.Name.toLowerCase().includes(word)||item.BranchType.toLowerCase().includes(word)){
            return item;
        }
    })

    // console.log(alloffices)
    showOffices(alloffices)

}