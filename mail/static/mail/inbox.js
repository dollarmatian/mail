document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email)



  // By default, load the inbox
  load_mailbox('inbox');
});
// recipients, subject, body, timestamp
// document.querySelector('#compose-recipients').value = `${recipients}`;
// document.querySelector('#compose-subject').value = `${subject}`;
// document.querySelector('#compose-body').value = `<br>---${timestamp}--- <br>${body}`;
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#message-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields

  
  document.querySelector('#compose-recipients').value = ``;
  document.querySelector('#compose-subject').value = ``;
  document.querySelector('#compose-body').value = ``;

}

  // Send an Email

  function send_email(evt) {
    evt.preventDefault()
   

    const recipients = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients,
        subject,
        body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result

      load_mailbox('sent')
     
  });

  
  }

  function reply_email(id) {

    // Show compose view and hide other views
    document.querySelector('#message-view').style.display = 'none';
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
  
    // Edit composition fields
  
    fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(data => {
 
      document.querySelector('#compose-recipients').value = `${data.sender}`;
      document.querySelector('#compose-subject').value = `${data.subject}`;
      document.querySelector('#compose-body').value = `On [${data.timestamp}] [${data.sender}] wrote ------ [${data.body}] ------`;
  
    })}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#message-view').style.display = 'none';
  
  document.querySelector('#message-buttons').innerHTML = ''

  const list = document.querySelector('#emails-list') 
  list.innerHTML = '' 
  // Show the mailbox name
  document.querySelector('#emails-heading').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(data => {

    // console.log(data);
      data.forEach(data =>{

         const li = document.createElement("LI")
         if (!data.read){
          li.style.background = 'white'
         }
         else {
          li.style.background = 'lightgrey'
         }
         li.innerHTML = `<button onClick= {getMail(${data.id})}>View Email</button>`
         li.append(` ${data.sender} ||  ${data.subject}  ||  ${data.timestamp}`)
        list.append(li)
        }   
      );
      // return false
  });
}

function getMail(id) {
  document.querySelector('#message-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(data => {
    let archived = 'mark'
    if (data.archived) {
      archived = 'remove'
    }

    const user_email = document.querySelector('#user-email').innerHTML
    console.log((data.sender == user_email))
    const buttons = document.querySelector('#message-buttons')
    if (data.sender.toString() != user_email.toString()){
     
   
   
    buttons.innerHTML = `<button onclick={reply_email(${data.id})}>Reply</button>
    <button onclick={mark_read(${id})}>Mark Unread</button>
    <button onclick={${archived}_archive(${id})}>${archived} Archived</button>`
    }
 
    const email = document.querySelector('#message-content') 
    email.innerHTML = `<li><b>Date:</b> ${data.timestamp}</li>
    <li><b>Sender:</b> ${data.sender}</li>
    <li><b>Recipients:</b> ${data.recipients}</li>
    <li><b>Subject:</b> ${data.subject}</li>
    <li><b>Message:</b></li>
    <li>${data.body}</li>`
    
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })

    
  })
  
}

function mark_read(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  })

  .then(result => {
      // Print result

      load_mailbox('inbox')
     
  });

}

function mark_archive(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
  .then(response => load_mailbox('inbox'))

}
function remove_archive(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
.then(response => load_mailbox('inbox'))

}