function openTab(event, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-button');

    // Hide all tab contents and remove active class from all buttons
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content and add active class to the button
    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Optionally, open the first tab by default
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab-button').click();
});
