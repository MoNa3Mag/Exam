const clintIo = io("http://localhost:3000")


clintIo.emit("updateSocketID" , '62bf35c8c6742d46ab246dc5')



$("#addProduct").click(function(){
    const assignObject = {
        title : $("#title").val(),
        desc : $("#desc").val(),
        price : $("#price").val(),
    }
})
clintIo.on("BEMessage" , (data)=>{
    displayData(data)
})

function displayData(data) {;
        let cartoona = '';
        for (let i = 0; i < data.length; i++) {
            cartoona += `
                  <div class="col-md-4 my-2">
                  <div class="p-2">
                      <div class="card text-center" style="width: 18rem;">
                          <div class="card-body">
                              <h5 class="card-title text-info">${data[i].title}</h5>
                              <h6 class="card-text text-warning">${data[i].desc}</h6>
                              <h6 class="card-text text-warning">${data[i].price}</h6>
                              <img src="${data[i].QRcode}">
                          </div>
                      </div>
                  </div>
              </div>`   
        }
        $(".rowData").html(cartoona)
    }