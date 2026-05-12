
function notFound(req,res){
    res.status(404).json({
        status: 404,
        msg: "Route not found" 
    })
}
function appError(err,req,res,next){
    console.error(err.stack)
    res.status(500).json({
        title: "error",
        from: req.ip,
        error: err
    })
}


module.exports = {appError, notFound}