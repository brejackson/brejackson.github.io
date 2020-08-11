/*
-This is the Web Data Connector
*/
(function() {
    console.log("Rally WDC Has Started");
    //Settings configuration for oauth requests
    var config = {
      state: '1234-5678-90',
      response_type:'code',
      redirectUri: 'http://localhost:3000/redirect', //This is the same as callback url that you set in oauth settings in rally during setup
      client_id: '5d99fc177c7d453eabe0c68203ca4200',
      authUrl: 'https://rally1.rallydev.com/',
      scope: 'alm'
  };
    
    //When the index page is loaded this function is called
    $(document).ready(function() {
        //Getting the access token from cookie storage
      var accessToken = Cookies.get("accessToken");
        //Logic for displaying UI on index page
      var hasAuth = accessToken && accessToken.length > 0;
        //Callling helper function for setting UI
      updateUIWithAuthState(hasAuth);
        
        //When connection button is clicked on the index.html page this function is called
      $("#connectbutton").click(function() {
          //Helper function to authenticate the client
          doAuthRedirect();
      });
  });
    
    //This is the helper function that creates the authredirect url and then sends the user to this url to authenticate the user and get the OAuth token
    function doAuthRedirect() {
        //Creating the url to authenticate the client using config from above
      var url = config.authUrl + 'login/oauth2/auth?state=' + config.state +
              '&response_type=' + config.response_type + '&redirect_uri=' + config.redirectUri + '&client_id=' + config.client_id + '&scope=' + config.scope;
        //Sends the user to the url when connectbutton is clicked
      window.location.href = url;
  }
    
    //------------- OAuth Helpers -------------//
    //This function creates the query that is used to retrerive the data the user requested from the Rally API
    function createQueryURL(type,query,fetch,pagesize) {
      return 'https://rally1.rallydev.com/slm/webservice/v2.0/' + type + '?&query=' + query + '&fetch=' + fetch+ '&pagesize=' + pagesize;
  }
    // This function togglels the label shown depending
    // on whether or not the user has been authenticated
    function updateUIWithAuthState(hasAuth) {
      if (hasAuth) {
          $(".notsignedin").css('display', 'none');
          $(".signedin").css('display', 'block');
      } else {
          $(".notsignedin").css('display', 'block');
          $(".signedin").css('display', 'none');
      }
  } 
    
  //------------- Tableau WDC code -------------//
  // Create tableau connector, should be called first
    var myConnector = tableau.makeConnector();
    
    //myConnector.int is called at the beggining of every phase
    myConnector.init = function(initCallback) {
        //Get the access token from cookie storage
      var accessToken = Cookies.get("accessToken");
        
      console.log("Access Token: ", accessToken);
        
        //Logic for UI 
      var hasAuth = (accessToken && accessToken.length > 0) || tableau.password.length > 0;
        
        //Calls helper function to update the UI
      updateUIWithAuthState(hasAuth);
        
        //Function called when get data button is clicked
      $("#getdatabutton").click(function() {
          //Setting the tableau connection name
          tableau.connectionName = "Rally Web Data Connector";
          //Always showing authorization 
          tableau.alwaysShowAuthUI =true;
          //Sending info to tableau
          tableau.submit();
      });
        
      //Call back to Init fuction
      initCallback();

      // If we are not in the data gathering phase, we want to store the token
      // This allows us to access the token in the data gathering phase
      //Check to see what phase of the web data connector is broken up into
      if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
          if (hasAuth) {
              //Store the access token in tableau
              tableau.password = accessToken;
              if (tableau.phase == tableau.phaseEnum.authPhase) {
                // Auto-submit here if we are in the auth phase
                tableau.submit()
              }
              return;
          }
      }
  };
    //Defining table schema
    myConnector.getSchema = function (schemaCallback) {   
        console.log("Get Schema Function Started");
        tableau.log("Get Schema Function Started");
    //defining schemas to place data     
    var userStory_cols = [
            // Define an id,  alias, and data type to create a col in the tabel
        { id : "FormattedID", alias : "FormattedID", dataType : tableau.dataTypeEnum.string },
        { id : "PortfolioIitemFormattedID", alias : "PortfolioIitemFormattedID", dataType : tableau.dataTypeEnum.string }, 
        //{ id : "RunDate", alias : "Run Date", dataType : tableau.dataTypeEnum.date },
    ];

    var testCase_cols = [
            // Define an id,  alias, and data type to create a col in the tabel
        { id : "FormattedID", alias : "FormattedID", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "WorkProductFormattedID", alias : "WorkProductFormattedID", dataType : tableau.dataTypeEnum.string }, 
        
       // { id : "Tags", alias : "Tags", dataType : tableau.dataTypeEnum.string },
        
        { id : "ProjectName", alias : "Project Name", dataType : tableau.dataTypeEnum.string },

        { id : "Results", alias : "Results", dataType : tableau.dataTypeEnum.int },

        { id : "Type", alias : "Type", dataType : tableau.dataTypeEnum.string },
        
        { id : "LastVerdict", alias : "LastVerdict", dataType : tableau.dataTypeEnum.string },

        { id : "DateFormatted", alias : "DateFormatted", dataType : tableau.dataTypeEnum.date },
       // { id : "TaskEstimateTotal", alias : "Task Estimate Total", dataType : tableau.dataTypeEnum.float },
        
       // { id : "ProjectID", alias : "Project ID", dataType : tableau.dataTypeEnum.string },
    ];

    var defect_cols = [
            // Define an id,  alias, and data type to create a col in the tabel
        { id : "FormattedID", alias : "FormattedID", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "Name", alias : "Name", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "ProjectName", alias : "Project Name", dataType : tableau.dataTypeEnum.string },

        { id : "Resolution", alias : "Resolution", dataType : tableau.dataTypeEnum.string },

        { id : "State", alias : "State", dataType : tableau.dataTypeEnum.string },
        
        { id : "CreatedBy", alias : "CreatedBy", dataType : tableau.dataTypeEnum.string },

        { id : "Severity", alias : "Severity", dataType : tableau.dataTypeEnum.string },

        { id : "TestCaseFormattedID", alias : "TestCaseFormattedID", dataType : tableau.dataTypeEnum.string },

        { id : "UserStoryID", alias : "UserStoryID", dataType : tableau.dataTypeEnum.string },
        
    ];

    var feature_cols = [
            // Define an id,  alias, and data type to create a col in the tabel
        { id : "FormattedID", alias : "FormattedID", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "Name", alias : "Name", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "ProjectName", alias : "Project Name", dataType : tableau.dataTypeEnum.string },

        //{ id : "Release", alias : "Release", dataType : tableau.dataTypeEnum.string },

        //{ id : "State", alias : "State", dataType : tableau.dataTypeEnum.string },
        
       // { id : "CreatedBy", alias : "CreatedBy", dataType : tableau.dataTypeEnum.string },

        { id : "Tags", alias : "Tags", dataType : tableau.dataTypeEnum.string },

       // { id : "PlannedStartDate", alias : "PlannedStartDate", dataType : tableau.dataTypeEnum.string },

       // { id : "PlannedEndDate", alias : "PlannedEndDate", dataType : tableau.dataTypeEnum.string },

       // { id : "ActualStartDate", alias : "ActualStartDate", dataType : tableau.dataTypeEnum.string },

       // { id : "ActualdEndDate", alias : "ActualdEndDate", dataType : tableau.dataTypeEnum.string },

        { id : "CapabilityFormattedID", alias : "CapabilityFormattedID", dataType : tableau.dataTypeEnum.string },

       // { id : "PercentDoneByStoryPlanEstimate", alias : "PercentDoneByStoryPlanEstimate", dataType : tableau.dataTypeEnum.float },

       // { id : "PercentDoneByStoryCount", alias : "PercentDoneByStoryCount", dataType : tableau.dataTypeEnum.float },
    ];

    var capability_cols = [
            // Define an id,  alias, and data type to create a col in the tabel
        { id : "FormattedID", alias : "FormattedID", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "Name", alias : "Name", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "ProjectName", alias : "Project Name", dataType : tableau.dataTypeEnum.string },

        //{ id : "Release", alias : "Release", dataType : tableau.dataTypeEnum.string },

        //{ id : "State", alias : "State", dataType : tableau.dataTypeEnum.string },
        
       // { id : "CreatedBy", alias : "CreatedBy", dataType : tableau.dataTypeEnum.string },

        { id : "Tags", alias : "Tags", dataType : tableau.dataTypeEnum.string },

       // { id : "PlannedStartDate", alias : "PlannedStartDate", dataType : tableau.dataTypeEnum.string },

       // { id : "PlannedEndDate", alias : "PlannedEndDate", dataType : tableau.dataTypeEnum.string },

       // { id : "ActualStartDate", alias : "ActualStartDate", dataType : tableau.dataTypeEnum.string },

       // { id : "ActualdEndDate", alias : "ActualdEndDate", dataType : tableau.dataTypeEnum.string },

       // { id : "PercentDoneByStoryPlanEstimate", alias : "PercentDoneByStoryPlanEstimate", dataType : tableau.dataTypeEnum.float },

       // { id : "PercentDoneByStoryCount", alias : "PercentDoneByStoryCount", dataType : tableau.dataTypeEnum.float },
    ];
        //Defining the table for tableau
    var userStoryTabel = {
        id : "UserStory",
        alias : "User Story Data",
        columns : userStory_cols
    };
    var testCaseTable = {
        id : "TestCase",
        alias : "Test Case Data",
        columns : testCase_cols
    };
    var defectTable = {
        id : "Defect",
        alias : "Defect Data",
        columns : defect_cols
    };
    var featureTable = {
        id : "Feature",
        alias : "Feature Data",
        columns : feature_cols
    };
    var capabilityTable = {
        id : "Capability",
        alias : "Capability Data",
        columns : capability_cols
    };

//Telling tableau what tabels it should expect to get data for can be multiple tables
  schemaCallback([userStoryTabel, testCaseTable, defectTable, featureTable, capabilityTable]);
  // testCaseTable, defectTable, featureTable, capabilityTable]
};
    //Gathering data for tableau only called during the get data phase
    myConnector.getData = function(table, doneCallback) {
        console.log("Get Data Function Called");
        tableau.log("Get Data Function Called");
            
        //Get the project the user requested data for from cookies
        var projectID = "247223054280";
        //Cookies.get("projectID");
          
        //The table the data will be stored in
        var tableData = [];
        
        //--------------Setting Date----------------//
        var today = new Date();
        var dd = today.getDay();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        //Incremental Refresh
        var incrementDate = new Date();
        incrementDate = Date.parse(table.incrementValue || 1);
        
        if(dd<10) {dd = '0'+dd} 

        if(mm<10) {mm = '0'+mm}
        
        today = mm + '/' + dd + '/' + yyyy;
        var todayTest=today+1;
        //--------------Setting Date----------------//
        
        //Getting access token from tableau password storage
        var accessToken = tableau.password;
       

        ///////////////////////////////////// USER STORY /////////////////////////////////////
        //Checking to see which table is being requested to get data for 
        function callUserStoryAPI(p){
        
        //if (table.tableInfo.id == "UserStory"){
          var pageStart = (p * 2000) + 1;
          //Creating the request to retreive data from rally
          console.log("projectid rallywdc: ", projectID);
          var xhr = $.ajax({
            //Sending the access token to rally to show we have been authenticated 
            beforeSend: function(request) {
              request.setRequestHeader("zsessionid", accessToken);
            },
            //Url that for that request
            url: "https://rally1.rallydev.com/slm/webservice/v2.0/hierarchicalrequirement?workspace=https://rally1.rallydev.com/slm/webservice/v2.0/workspace/23724738313&query=(PortfolioItem.Tags.Name%20contains%20Testing)&fetch=FormattedID,PortfolioItem&start="+ pageStart +"&pagesize=2000",
            dataType: 'json',
            success: function (data) {
              //Where all the JSON data is stored
              var feat=data;
              console.log(feat);
              //Reterving data for entery in feat object
              for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++) {
                //pushing data to tableau tabel object
                tableData.push({
                  "FormattedID": feat.QueryResult.Results[i].FormattedID,
                  "PortfolioIitemFormattedID": feat.QueryResult.Results[i].PortfolioItem.FormattedID,
                }); 
              }
              var lastPage = false;

                if (p == Math.ceil(feat.QueryResult.TotalResultCount/2000)){
                  lastPage = true;
                }
                if (!lastPage){
                  table.appendRows(tableData);
                  tableData = [];
                  callUserStoryAPI(p+1);
                }else{
                  doneCallback();
                }

              //table.appendRows(tableData);
              //doneCallback();
            }
          });
        }

        if (table.tableInfo.id == "UserStory"){
          var p = 0;
          callUserStoryAPI(p);
        }
        ///////////////////////////////////// TEST CASES /////////////////////////////////////
        function callTestCaseAPI(p) {
            var pageStart = (p * 2000) + 1;
            var xhr = $.ajax({
              //Sending the access token to rally to show we have been authenticated 
              beforeSend: function(request) {
                request.setRequestHeader("zsessionid", accessToken);
              },
            
              //Url that for that request
              url: "https://rally1.rallydev.com/slm/webservice/v2.0/testcase?workspace=https://rally1.rallydev.com/slm/webservice/v2.0/workspace/23724738313&query=(WorkProduct.Tags.Name%20contains%20Testing)&fetch=FormattedID,WorkProduct,Project,Results,Type,LastVerdict,LastRun&start="+ pageStart +"&pagesize=2000",
              dataType: 'json',
              success: function (data) {
                //Where all the JSON data is stored
                var feat=data;
                console.log(feat);
                var dateFormatted;
                //Reterving data for entery in feat object
                for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++) {

                  dateFormatted = new Date(feat.QueryResult.Results[i].LastRun);
                  //pushing data to tableau tabel object
                  tableData.push({
                    "FormattedID": feat.QueryResult.Results[i].FormattedID,
                    "WorkProductFormattedID": feat.QueryResult.Results[i].WorkProduct,
                    // "Tags": feat.QueryResult.Results[i].Tags,
                    "ProjectName": feat.QueryResult.Results[i].Project._refObjectName,
                    //"ProjectID": feat.QueryResult.Results[i].Project._ref.substring(feat.QueryResult.Results[i].Project._ref.lastIndexOf("/")+1, feat.QueryResult.Results[i].Project._ref.length ),
                    "Results": feat.QueryResult.Results[i].Results.Count,
                    "Type": feat.QueryResult.Results[i].Type,
                    "LastVerdict": feat.QueryResult.Results[i].LastVerdict,
                    "DateFormatted": dateFormatted,
                    //=IF([@[Last Run]]="","",DATEVALUE(LEFT([@[Last Run]],10)))
                  }); 
                  if(tableData[i].WorkProductFormattedID !== null){ 
                    try{
                      tableData[i].WorkProductFormattedID =  feat.QueryResult.Results[i].WorkProduct.FormattedID;      
                    }
                    catch(e){
                      tableData[i].WorkProductFormattedID = null;
                    }
                  }
                }
                var lastPage = false;

                if (p == Math.ceil(feat.QueryResult.TotalResultCount/2000)){
                  lastPage = true;
                }
                if (!lastPage){
                  table.appendRows(tableData);
                  tableData = [];
                  callTestCaseAPI(p+1);

                }else{
                  doneCallback();
                }
              }
            });
        }

        if (table.tableInfo.id == "TestCase"){
          var p = 0;
          callTestCaseAPI(p);
        }
        ///////////////////////////////////// DEFECTS /////////////////////////////////////
        function callDefectAPI(p) {
            var pageStart = (p * 2000) + 1;
            var xhr = $.ajax({
              //Sending the access token to rally to show we have been authenticated 
              beforeSend: function(request) {
                request.setRequestHeader("zsessionid", accessToken);
              },
            
              //Url that for that request
              url: "https://rally1.rallydev.com/slm/webservice/v2.0/defect?workspace=https://rally1.rallydev.com/slm/webservice/v2.0/workspace/23724738313&query=&fetch=FormattedID,Name,Project,Resolution,State,CreatedBy,Severity,TestCase,Requirement&start="+ pageStart +"&pagesize=2000",
              dataType: 'json',
              success: function (data) {
                //Where all the JSON data is stored
                var feat=data;
                console.log(feat);
                //Reterving data for entery in feat object
                for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++) {
                  //pushing data to tableau tabel object
                  tableData.push({
                    "FormattedID": feat.QueryResult.Results[i].FormattedID,
                    "Name": feat.QueryResult.Results[i].Name,
                    "ProjectName": feat.QueryResult.Results[i].Project._refObjectName,
                    "Resolution": feat.QueryResult.Results[i].Resolution,
                    "State": feat.QueryResult.Results[i].State,
                    "CreatedBy": feat.QueryResult.Results[i].CreatedBy._refObjectName,
                    "Severity": feat.QueryResult.Results[i].Severity,
                    "TestCaseFormattedID": feat.QueryResult.Results[i].TestCase,
                    "UserStoryID": feat.QueryResult.Results[i].Requirement,
                  }); 
                  if(tableData[i].TestCaseFormattedID !== null){ 
                    try{             
                      tableData[i].TestCaseFormattedID = feat.QueryResult.Results[i].TestCase.FormattedID;
                    }
                    catch(e){
                      tableData[i].TestCaseFormattedID = feat.QueryResult.Results[i].TestCase;
                    }
                  }
                  if(tableData[i].UserStoryID !== null){ 
                    try{             
                      tableData[i].UserStoryID = feat.QueryResult.Results[i].Requirement.FormattedID;
                    }
                    catch(e){
                      tableData[i].TestCaseFormattedID = feat.QueryResult.Results[i].Requirement;
                    }
                  }
                }
                var lastPage = false;

                if (p == Math.ceil(feat.QueryResult.TotalResultCount/2000)){
                  lastPage = true;
                }
                if (!lastPage){
                  table.appendRows(tableData);
                  tableData = [];
                  callDefectAPI(p+1);
                }else{
                  doneCallback();
                }
              }
            });
        }

        if (table.tableInfo.id == "Defect"){
          var p = 0;
          callDefectAPI(p);
        }

        // ///////////////////////////////////// Features /////////////////////////////////////
        function callFeatureAPI(p) {
            var pageStart = (p * 2000) + 1;
            var xhr = $.ajax({
              //Sending the access token to rally to show we have been authenticated 
              beforeSend: function(request) {
                request.setRequestHeader("zsessionid", accessToken);
              },
            
              //Url that for that request
              url: "https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature?workspace=https://rally1.rallydev.com/slm/webservice/v2.0/workspace/23724738313&query=&fetch=FormattedID,Name,Project,Tags,Parent&start="+ pageStart +"&pagesize=2000",
              dataType: 'json',
              success: function (data) {
                //Where all the JSON data is stored
                var feat=data;
                //Reterving data for entery in feat object
                for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++) {
                  //pushing data to tableau tabel object
                  tableData.push({
                    "FormattedID": feat.QueryResult.Results[i].FormattedID,
                    "Name": feat.QueryResult.Results[i].Name,
                    "ProjectName": feat.QueryResult.Results[i].Project._refObjectName,
                    //"Release": feat.QueryResult.Results[i].Release,
                    //"State": feat.QueryResult.Results[i].State,
                    //"CreatedBy": feat.QueryResult.Results[i].CreatedBy._refObjectName,
                    "Tags": feat.QueryResult.Results[i].Tags,
                    //"PlannedStartDate": feat.QueryResult.Results[i].PlannedStartDate,
                    //"PlannedEndDate": feat.QueryResult.Results[i].PlannedEndDate,
                   //"ActualStartDate": feat.QueryResult.Results[i].ActualStartDate,
                    //"ActualdEndDate": feat.QueryResult.Results[i].ActualEndDate,
                    "CapabilityFormattedID": feat.QueryResult.Results[i].Parent,
                    //"PercentDoneByStoryPlanEstimate": feat.QueryResult.Results[i].PercentDoneByStoryPlanEstimate,
                    //"PercentDoneByStoryCount": feat.QueryResult.Results[i].PercentDoneByStoryCount,
                  });
                  // if(tableData[i].Release !== null){  
                  //   try{
                  //     tableData[i].Release= feat.QueryResult.Results[i].Release._refObjectName;           
                  //   }
                  //   catch(e){
                  //     tableData[i].Release= feat.QueryResult.Results[i].Release;
                  //   }
                  // }
                  if(tableData[i].Tags !== null){  
                    try{
                      if(feat.QueryResult.Results[i].Tags._tagsNameArray.length > 0){
                        for (var t = 0, tLen = feat.QueryResult.Results[i].Tags._tagsNameArray.length; t < tLen; t++){
                          tableData[i].Tags= feat.QueryResult.Results[i].Tags._tagsNameArray[t].Name;  
                        }
                        //"_tagsNameArray": [{"Name": "Testing"   
                      }else{
                        tableData[i].Tags= feat.QueryResult.Results[i].Tags._tagsNameArray;
                      }      
                    }
                    catch(e){
                      tableData[i].Tags= feat.QueryResult.Results[i].Tags;
                    }
                  }
                  if(tableData[i].CapabilityFormattedID !== null){ 
                    try{             
                      tableData[i].CapabilityFormattedID= feat.QueryResult.Results[i].Parent.FormattedID;
                    }
                    catch(e){
                      tableData[i].CapabilityFormattedID= null;
                    }
                  }
                }
                var lastPage = false;

                if (p == Math.ceil(feat.QueryResult.TotalResultCount/2000)){
                  lastPage = true;
                }
                if (!lastPage){
                  table.appendRows(tableData);
                  tableData = [];
                  callFeatureAPI(p+1);
                }else{
                  doneCallback();
                }
              }
            });
        }

        if (table.tableInfo.id == "Feature"){
          var p = 0;
          callFeatureAPI(p);
        }
        // ///////////////////////////////////// Capabilities /////////////////////////////////////
        function callCapabilityAPI(p) {
            var pageStart = (p * 2000) + 1;
            var xhr = $.ajax({
              //Sending the access token to rally to show we have been authenticated 
              beforeSend: function(request) {
                request.setRequestHeader("zsessionid", accessToken);
              },
            
              //Url that for that request
              //url: "https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature?workspace=https://rally1.rallydev.com/slm/webservice/v2.0/workspace/23724738313&query=&fetch=FormattedID,Name,Project,Tags,Parent&start="+ pageStart +"&pagesize=2000",
              url: "https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/capability?workspace=https://rally1.rallydev.com/slm/webservice/v2.0/workspace/23724738313&query=&fetch=FormattedID,Name,Project,Tags&start="+ pageStart +"&pagesize=2000",
              dataType: 'json',
              success: function (data) {
                //Where all the JSON data is stored
                var feat=data;
                //Reterving data for entery in feat object
                for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++) {
                  //pushing data to tableau tabel object
                  tableData.push({
                    "FormattedID": feat.QueryResult.Results[i].FormattedID,
                    "Name": feat.QueryResult.Results[i].Name,
                    "ProjectName": feat.QueryResult.Results[i].Project._refObjectName,
                    //"Release": feat.QueryResult.Results[i].Release,
                    //"State": feat.QueryResult.Results[i].State,
                    //"CreatedBy": feat.QueryResult.Results[i].CreatedBy._refObjectName,
                    "Tags": feat.QueryResult.Results[i].Tags,
                    //"PlannedStartDate": feat.QueryResult.Results[i].PlannedStartDate,
                    //"PlannedEndDate": feat.QueryResult.Results[i].PlannedEndDate,
                   //"ActualStartDate": feat.QueryResult.Results[i].ActualStartDate,
                    //"ActualdEndDate": feat.QueryResult.Results[i].ActualEndDate,
                    //"PercentDoneByStoryPlanEstimate": feat.QueryResult.Results[i].PercentDoneByStoryPlanEstimate,
                    //"PercentDoneByStoryCount": feat.QueryResult.Results[i].PercentDoneByStoryCount,
                  });
                  // if(tableData[i].Release !== null){  
                  //   try{
                  //     tableData[i].Release= feat.QueryResult.Results[i].Release._refObjectName;           
                  //   }
                  //   catch(e){
                  //     tableData[i].Release= feat.QueryResult.Results[i].Release;
                  //   }
                  // }
                  if(tableData[i].Tags !== null){  
                    try{
                      if(feat.QueryResult.Results[i].Tags._tagsNameArray.length > 0){
                        for (var t = 0, tLen = feat.QueryResult.Results[i].Tags._tagsNameArray.length; t < tLen; t++){
                          tableData[i].Tags= feat.QueryResult.Results[i].Tags._tagsNameArray[t].Name;  
                        }
                        //"_tagsNameArray": [{"Name": "Testing"   
                      }else{
                        tableData[i].Tags= feat.QueryResult.Results[i].Tags._tagsNameArray;
                      }      
                    }
                    catch(e){
                      tableData[i].Tags= feat.QueryResult.Results[i].Tags;
                    }
                  }
                }
                var lastPage = false;

                if (p == Math.ceil(feat.QueryResult.TotalResultCount/2000)){
                  lastPage = true;
                }
                if (!lastPage){
                  table.appendRows(tableData);
                  tableData = [];
                  callCapabilityAPI(p+1);
                }else{
                  doneCallback();
                }
              }
            });
        }

        if (table.tableInfo.id == "Capability"){
          var p = 0;
          callCapabilityAPI(p);
        }

    };
    //Register connector with tableau 
    tableau.registerConnector(myConnector);
})();



                  // "Rank": feat.QueryResult.Results[i].Rank,
                  // "ScheduleState": feat.QueryResult.Results[i].ScheduleState,
                  // "IterationName": feat.QueryResult.Results[i].Iteration,
                  // "IterationID": feat.QueryResult.Results[i].Iteration,
                  // "Tags": feat.QueryResult.Results[i].Tags,
                  // "StoryType": feat.QueryResult.Results[i].c_Type,
                  // "WorkState": feat.QueryResult.Results[i].c_WorkState,
                  // "AcceptedDate": feat.QueryResult.Results[i].AcceptedDate,
                  // "IsTestable": feat.QueryResult.Results[i].c_IsTestable,
                  // "FeatureNumber": feat.QueryResult.Results[i].Feature,
                  // "FeatureName": feat.QueryResult.Results[i].Feature,
                  // "OwnerName": feat.QueryResult.Results[i].Owner,
                  // "ProjectName": feat.QueryResult.Results[i].Project._refObjectName,
                  // "ProjectID": feat.QueryResult.Results[i].Project._ref.substring(feat.QueryResult.Results[i].Project._ref.lastIndexOf("/")+1, feat.QueryResult.Results[i].Project._ref.length ),
                  // "ReleaseName": feat.QueryResult.Results[i].Release,
                  // "ReleaseID": feat.QueryResult.Results[i].Release,
                  // "Capability": feat.QueryResult.Results[i].c_Capability,
                  // "RunDate": today,
                  // "ObjectID": feat.QueryResult.Results[i].ObjectID,
                  // "DirectChildren": feat.QueryResult.Results[i].DirectChildrenCount,
                  // "Name": feat.QueryResult.Results[i]._refObjectName,
                  // "Description":feat.QueryResult.Results[i].Description,
                  // "Ready":feat.QueryResult.Results[i].Ready,
                  // "AcceptanceCriteria":feat.QueryResult.Results[i].c_AcceptanceCriteria,
                  // "Discussion":feat.QueryResult.Results[i].Discussion.Count,
                  // "Blocked":feat.QueryResult.Results[i].Blocked,
                  // "TaskEstimateTotal":feat.QueryResult.Results[i].TaskEstimateTotal,
                  // "TaskRemainingTotal":feat.QueryResult.Results[i].TaskRemainingTotal,
              
                  //Error Handeling  
              //for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++){
                //If a user story has an itteration update its info     
                // if(tableData[i].IterationID !== null){
                //   tableData[i].IterationName= feat.QueryResult.Results[i].Iteration._refObjectName;
                //   tableData[i].IterationID= feat.QueryResult.Results[i].Iteration.ObjectID;
                // }
                // //If a user story has an itteration update its info  
                // if(tableData[i].FeatureName !== null){ 
                //   try{
                //     tableData[i].FeatureNumber=  feat.QueryResult.Results[i].Feature.ObjectID;               
                //     tableData[i].FeatureName= feat.QueryResult.Results[i].Feature.Name;
                //   }
                //   //If a userstory doesnt have any features #########################################333
                //   catch(e){
                //     tableData[i].FeatureNumber =null;
                //     tableData[i].FeatureName= null;
                //   }
                // }
                // //If a user story has an owner update the tabel
                // if(tableData[i].OwnerName !== null){
                //   tableData[i].OwnerName= feat.QueryResult.Results[i].Owner._refObjectName;           
                // }
                // //If a use stor has a realease update the tabel
                // if(tableData[i].ReleaseName !== null){
                //   tableData[i].ReleaseName=  feat.QueryResult.Results[i].Release.Name;         
                //   tableData[i].ReleaseID= feat.QueryResult.Results[i].Release.ObjectID;
                // }
                //     //
                // try{
                //   tableData[i].Tags= feat.QueryResult.Results[i].Tags._tagsNameArray.Name;           
                // }
                // catch(e){
                //   tableData[i].Tags= feat.QueryResult.Results[i].Tags;
                // }
              //} 
