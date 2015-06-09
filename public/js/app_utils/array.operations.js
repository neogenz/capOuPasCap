__.namespace(app, 'array');

app.array = {
    addElement: _addElement,
    removeElement: _removeElement
};

function _addElement(array, elementToAdd, indexWhereElementShouldBeInput){
    array.splice(indexWhereElementShouldBeInput, 0, elementToAdd);
}

function _removeElement(array, indexOfElementToRemove){
    array.splice(indexOfElementToRemove, 1);
}