function Contact() {
    return (
        <div class="container page create">
            <a>How can we help you?</a> <h1 id="share-title">Contact Us!</h1>
           <form class="contact-form">
            <p></p>
            <div class="mb-3">
                <div class="row-flex">
                    <div class="col">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Firstname</label>
                            <input type="text" class="form-control" placeholder="John" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Lastname</label>
                            <input type="text" class="form-control" placeholder="Doe" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" placeholder="Johndoe@example.com" class="form-control" id="email" aria-describedby="emailHelp"/>
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="message" class="form-label">Send Message</label>
                <textarea type="text" rows="5" class="form-control" placeholder="How can we help you?"  id="message"/>
            </div>
            <button type="submit" class="btn btn-primary btn-contact">Submit</button>
            </form>
            <div class="background-overlay overlay-contact"></div>

        </div>
    )
}

export default Contact;