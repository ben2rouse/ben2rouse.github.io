from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time
import os

# URL to scrape
url = "https://ecvz.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/requisitions?location=Roseville%2C+CA%2C+United+States&locationId=300000002565591&locationLevel=city&mode=job-location&radius=25&radiusUnit=MI"

def get_job_titles_selenium(url):
    # Set up the WebDriver (ensure ChromeDriver is installed)
    service = Service("/opt/homebrew/bin/chromedriver")  # Adjust path if necessary
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    try:
        # Open the webpage
        driver.get(url)

        # Wait for the page to load
        time.sleep(5)  # Adjust based on your internet speed

        # Find all <span> elements with the class 'job-tile__title'
        job_titles = driver.find_elements(By.CLASS_NAME, "job-tile__title")

        # Extract and return the text content
        return [job.text for job in job_titles]

    finally:
        # Close the WebDriver
        driver.quit()

def count_keywords(job_titles, keywords):
    counts = {keyword: sum(keyword.lower() in title.lower() for title in job_titles) for keyword in keywords}
    return counts

def store_and_compare_counts(counts, file_path):
    previous_counts = {}

    # Check if the file exists and read previous counts
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            previous_counts = eval(file.read())

    # Compare current counts with previous counts
    if counts != previous_counts:
        print("Counts have changed:")
        print("Previous counts:", previous_counts)
        print("Current counts:", counts)
        print("\n" + url)
        
        # Save the new counts to the file
        with open(file_path, "w") as file:
            file.write(str(counts))
    else:
        print("Counts have not changed.")

# Main workflow
job_titles = get_job_titles_selenium(url)
keywords = ["Data", "Intelligence", "Visualization", "Analyst"]
counts = count_keywords(job_titles, keywords)
store_and_compare_counts(counts, "keyword_counts.txt")
