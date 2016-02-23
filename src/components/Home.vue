<template>
  <div class="text-center">
    <h1>Welcome to Backbeam lambda</h1><hr/>

    <div class="row">
      <div class="col-sm-4 col-sm-offset-2">
        <button class="btn btn-primary btn-lg btn-block" @click="$parent.showOpenDialog()">Open a project</button>
      </div>
      <div class="col-sm-4">
        <button class="btn btn-primary btn-lg btn-block" @click="$parent.showProjectInit()">Create a new project</button>
      </div>
    </div>

    <hr/>

    <div class="row">
      <div class="col-md-4 col-md-offset-2 col-sm-5 col-sm-offset-1">
        <div class="panel panel-default">
          <div class="panel-body">
            <h2 style="font-size: 80px"><span class="fa fa-cloud-upload"></span></h2>
            <p>Create, test and deploy lambda functions</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-5">
        <div class="panel panel-default">
          <div class="panel-body">
            <h2 style="font-size: 80px"><span class="fa fa-link"></span></h2>
            <p>Map lambda functions to HTTP endpoints</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 col-md-offset-2 col-sm-5 col-sm-offset-1">
        <div class="panel panel-default">
          <div class="panel-body">
            <h2 style="font-size: 80px"><span class="fa fa-database"></span></h2>
            <p>Manage a local dynamodb database and sync it to the cloud</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-5">
        <div class="panel panel-default">
          <div class="panel-body">
            <h2 style="font-size: 80px"><span class="fa fa-star-o"></span></h2>
            <p>Go serverless with Backbeam and Amazon Web Services</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
