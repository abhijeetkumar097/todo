pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds-id')
        DOCKERHUB_USERNAME = 'aabhijeet097'
        MAIL_TO = 'aks1perman@gmail.com'
    }
    
    stages {
        stage('Backup Code') {
            steps {
                sh '''
                    timestamp=$(date +"%Y%m%d_%H%M%S")
                    mkdir -p backups
                    zip -r backups/backup_$timestamp.zip .
                '''
            }
        }

        stage('Set Timestamp') {
            steps {
                script {
                    env.BUILD_TAG = sh(script: "date +%Y%m%d%H%M%S", returnStdout: true).trim()
                    env.IMAGE_BACKEND = "${DOCKERHUB_USERNAME}/todo-backend:${BUILD_TAG}"
                    env.IMAGE_FRONTEND = "${DOCKERHUB_USERNAME}/todo-frontend:${BUILD_TAG}"
                }
            }
        }

        stage('Stop and Remove Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh '''
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                '''
            }
        }

        stage('Tagging the Image') {
            steps {
                sh '''
                    docker tag todo-backend $IMAGE_BACKEND
                    docker tag todo-frontend $IMAGE_FRONTEND
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                sh '''
                    docker push $IMAGE_BACKEND
                    docker push $IMAGE_FRONTEND
                '''
            }
        }

        stage('Start Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            mail to: "${MAIL_TO}",
                 subject: "🚀 CI/CD Success: Todo App [${BUILD_TAG}]",
                 body: "The build and deployment of your Dockerized app (Tag: ${BUILD_TAG}) completed successfully!"
        }
        failure {
            mail to: "${MAIL_TO}",
                 subject: "❌ CI/CD Failed: Todo App",
                 body: "Something went wrong. Please check the Jenkins logs."
        }
    }
}
