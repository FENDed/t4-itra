function checkAll() {
    let checkboxes = document.getElementsByClassName('checkbox');

    for(let i = 0; i < checkboxes.length; i++)  
        checkboxes[i].checked = true;
}

function uncheckAll() {
    let checkboxes = document.getElementsByClassName('checkbox');

    for(let i = 0; i < checkboxes.length; i++)  
        checkboxes[i].checked = false;
}