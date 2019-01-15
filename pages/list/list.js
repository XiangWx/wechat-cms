let http = require('../../utils/http.js')
// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listInfo:{}, //当前的分类
   shops:[], //子分类下的全部店铺
   pageIndex:0,
   pageSize:10,
   hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
loadMore(){
  //解构赋值
  let { pageIndex, pageSize } = this.data
  let params = { _page: ++pageIndex, _limit:pageSize}
  return http(`categories/${this.data.listInfo.id}/shops`, params).then(res => {
    //默认shops为空数组
    const totalCount = parseInt(res.header['X-Total-Count']) //一共的条数
    const hasMore = pageIndex * pageSize < totalCount  
    const shops = this.data.shops.concat(res.data)
    this.setData({ shops, pageIndex, hasMore })
  })
},

  onLoad: function (options) {
    http(`categories/${options.id}`).then(res=>{
      this.setData({listInfo:res.data})  //把获取到的数据存储在 listInfo
      wx.setNavigationBarTitle({ title: res.data.name}) //设置当前页面的标题

   //在这里http返回的就是一个promise 如果直接后面.then 没有实现promise的价值，在这里直接return ， return回来的就是一个promise对象，在后面 .then
    this.loadMore()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.listInfo.name){
      wx.setNavigationBarTitle({ title: this.data.listInfo.name })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { //下拉刷新时触发
    //下拉刷新默认是有3s的停留时间
    this.setData({ shops: [], pageIndex: 0, hasMore: true})
    //页面重新刷新之后，数据加载出来再停止下拉刷新
    this.loadMore().then(() => { wx.stopPullDownRefresh()})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //下拉加载下一页数据
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})