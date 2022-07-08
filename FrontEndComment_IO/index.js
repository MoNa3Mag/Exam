const clintIo = io("http://localhost:3000")


clintIo.emit("updateCommentSocketID" , '62bf35c8c6742d46ab246dc5')


$("#addCommen").click(function(){
    const assignObject = {
        ProductId : $("#ProductId").val(),
        createdBy : $("#createdBy").val(),
        commentBody : $("#commentBody").val(),
    }
})

clintIo.on("BEMessages" , (data)=>{
    displayData(data)
    console.log(data);

})

function displayData(data) {;
        let cartoona = '';
        for (let i = 0; i < data.length; i++) {
            cartoona += `
                  <div class="col-md-4 my-2">
                  <div class="p-2">
                      <div class="card text-center" style="width: 18rem;">
                          <div class="card-body">
                              <h5 class="card-title text-info">ProductId : ${data[i].ProductId}</h5>
                              <h6 class="card-text text-warning">CreatedBy : ${data[i].createdBy}</h6>
                              <h6 class="card-text text-danger">Comment : ${data[i].commentBody}</h6>
                          </div>
                      </div>
                  </div>
              </div>`   
        }
        $(".rowData").html(cartoona)
    }