class AuctionController {
  placeBid = (req, res, next) => {
    try {
      let bidderId = req.user?.id;
      let bidAmount = req.body;
      let auctionId = req.params.id;
      
    } catch (except) {}
  };
}

const auctionCtrl = new auctionController();
module.exports = auctionCtrl;
