

export default function HotelForm({searchDate, setCheckin_date, setCheckout_date, checkin_date, checkout_date}) {

return (
<>


  <div className='search'>
  <label className='search-labels' >CHECK-IN</label>
      <input
      value={checkin_date}
      type="text"
      placeholder="YYYY-MM-DD"
      onChange={(e) => setCheckin_date(e.target.value)}
      
      />
      <label className='search-labels' >CHECK-OUT</label>
      <input
      value={checkout_date}
      type="text"
      placeholder="YYYY-MM-DD"
      onChange={(e) => setCheckout_date(e.target.value)}
      onKeyPress={searchDate}
      />


  </div>

  </>
);

}



