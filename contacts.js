const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.resolve("./db/contacts.json");

const getListContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "UTF8");
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error.message);
  }
};

async function listContacts() {
  try {
    const contacts = await getListContacts();
    console.table(contacts);
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getListContacts();
    const contact = contacts.find(({ id }) => id === contactId.toString());

    if (!contact) {
      console.log(`contact with ${contactId} not found`);
      return;
    }

    console.log(contact);
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getListContacts();
    const contact = contacts.find(({ id }) => id === contactId.toString());

    if (!contact) {
      console.log(`contact with ${contactId} not found`);
      return;
    }

    const newContactsList = contacts.filter(
      ({ id }) => id !== contactId.toString()
    );

    await fs.writeFile(contactsPath, JSON.stringify(newContactsList));
    console.log("contact deleted:", contact);
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getListContacts();

    if (contacts.some((item) => item.name === name)) {
      console.log(`there is already a contact with this name`);
      return;
    }

    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    console.log("add contact:", newContact);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
