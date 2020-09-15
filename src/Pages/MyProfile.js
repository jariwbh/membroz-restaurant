import React from 'react'
import { getUser } from '../Helpers/Auth'
const MyProfile = (props) => {
    document.title = props.title
    window.scrollTo(0, 0);

    const data = getUser()
    const userDetails = data.user.property

    return (
        <React.Fragment>
            <div id="layoutSidenav_content">
                <div className="container-fluid">
                    <main className="flex-shrink-0 col-md-4 mt-3 container">
                        <section className="common-block">
                            <h2 className="mb-3 text-center"> My Profile </h2>
                            <div className="white-box-no-animate p-20">
                                <div className="form-group">
                                    <label htmlFor="text" className="user-select-all">Username <span style={{ color: 'red' }}>*</span> </label>
                                    <input type="text" name='username' className="form-control" id="username" aria-describedby="usernameHelp" readOnly style={{ fontWeight: 'bold' }} value={userDetails.fullname} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="user-select-all">Email <span style={{ color: 'red' }}>*</span> </label>
                                    <input type="email" name='email' className="form-control" id="email" aria-describedby="emailHelp" readOnly style={{ fontWeight: 'bold' }} value={userDetails.email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile" className="user-select-all">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                    <input type="mobile" name='mobile' className="form-control" id="mobile" readOnly style={{ fontWeight: 'bold' }} value={userDetails.mobile_number} />
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </React.Fragment>
    )
}

export default MyProfile
