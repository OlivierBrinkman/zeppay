import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import Send from "../assets/send.png";


function Contact(props) {
  const form = useRef();
  const [emailSend, setEmailSend] = useState(false);
  const [nameInvalid, setNameInvalid] = useState();
  const [emailInvalid, setEmailInvalid] = useState();
  const [messageInvalid, setMessageInvalid] = useState();
  const [emailLoading, setEmailLoading] = useState(false);
  document.title = "Zeppay - Contact"

  function handleSubmit(e) {
    e.preventDefault();
    setEmailLoading(true);

    if (e.target[0].value === "" || e.target[0].value === undefined) {
      setNameInvalid(true);
      toast("Name is required");
      setEmailLoading(false);
    } else {
      setNameInvalid(false);
    }
    if (e.target[1].value === "" || e.target[1].value === undefined) {
      setEmailInvalid(true);
      toast("Email is required");

      setEmailLoading(false);
    } else {
      setEmailInvalid(false);
    }
    if (e.target[3].value === "" || e.target[3].value === undefined) {
      setMessageInvalid(true);
      toast("Message is required");

      setEmailLoading(false);
    } else {
      setMessageInvalid(false);
    }

    if (
      e.target[0].value !== "" &&
      e.target[1].value !== "" &&
      e.target[3].value !== ""
    ) {
      const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICEID;
      const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATEID;
      const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLICKEY;
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
        () => {
          setEmailSend(true);
          setEmailLoading(false);

          setTimeout(async function () {
            setEmailSend(false);
            props.closeModal();
          }, 10000);
        },
        (err) => {
          alert(JSON.stringify(err));
          setEmailLoading(false);
        }
      );
    } else {
    }
  }
  return (
    <div class="container page create contact">
      {emailSend ? (
        <div id="thanks">
          {" "}
          <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            {" "}
            <circle
              class="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />{" "}
            <path
              class="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
          <h3>Thank you for your interest. </h3>
          <p>We will respond as soon as possible.</p>
        </div>
      ) : (
        <>
          <a>How can we help you?</a>
          <h1 id="share-title">Contact us!</h1>
          <Toaster toastOptions={{ className: "toaster toaster-danger" }} />
          <form onSubmit={handleSubmit} ref={form}>
            <div class="form-group">
              <label for="from_name">
               
                Name
              </label>

              <input
                aria-invalid={nameInvalid}
                onChange={() => setNameInvalid()}
                type="text"
                name="from_name"
                id="from_name"
                placeholder="John Doe"
              ></input>
            </div>
            <div class="form-group">
              <label for="from_email">
               
                Email
              </label>
              <input
                aria-invalid={emailInvalid}
                type="text"
                name="from_email"
                id="from_email"
                placeholder="Johndoe@example.com"
              ></input>
            </div>
            <div class="form-group">
              <label for="from_company">
                
                Company
              </label>
              <input
                type="text"
                name="from_company"
                id="from_company"
                placeholder="Magic Company"
              ></input>
            </div>
            <div class="form-group">
              <label for="from_message">
       
                Message
              </label>
              <textarea
                aria-invalid={messageInvalid}
                type="text"
                name="from_message"
                id="from_message"
                placeholder="How can we help you?"
                rows="4"
              ></textarea>
            </div>
            <button class="btn-send" type="submit" id="button">
              <span>{emailLoading ? "Sending..." : "Send"}</span>
              <img src={Send} width="22" />
            </button>
          </form>
        </>
      )}
      <div class="background-overlay w3-animate-bottom"></div>
    </div>
  );
}

export default Contact;
