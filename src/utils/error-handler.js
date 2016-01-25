export default e => {
  console.error(e.stack)
  swal({
    title: 'Error',
    text: `Error: ${e.message}`,
    type: 'error',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'Close',
  }, function() {
    backbeam.apiDeleteEndpoint(route)
      .catch(errorHandler)
  });
}
