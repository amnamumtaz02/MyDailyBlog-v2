pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Clone App Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/amnamumtaz02/MyDailyBlog-v2.git'
            }
        }

        stage('Build and Run App Containers') {
            steps {
                sh 'docker-compose -f docker-compose-jenkins.yml down || true'
                sh 'docker-compose -f docker-compose-jenkins.yml up -d'
                sh 'sleep 15'
                sh 'docker exec blog-app-v2-jenkins npx prisma db push'
            }
        }

        stage('Clone Test Repository') {
            steps {
                dir('tests') {
                    git branch: 'main', url: 'https://github.com/amnamumtaz02/MyDailyBlog-Tests.git'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('tests') {
                    sh 'docker build -t mydailyblog-tests .'
                    sh 'docker run --rm --network host mydailyblog-tests'
                }
            }
        }
    }

    post {
        always {
            emailext(
                subject: "Jenkins Test Results: ${currentBuild.result} - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>MyDailyBlog Test Results</h2>
                    <p>Build Status: <b>${currentBuild.result}</b></p>
                    <p>Job: ${env.JOB_NAME}</p>
                    <p>Build Number: ${env.BUILD_NUMBER}</p>
                    <p>Check console output: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL}",
                mimeType: 'text/html'
            )
        }
    }
}