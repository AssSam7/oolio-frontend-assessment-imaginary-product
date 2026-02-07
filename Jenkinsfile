pipeline {
  agent any

  environment {
    VERCEL_TOKEN = credentials('vercel-token')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Project') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy to Vercel') {
      steps {
        sh '''
          npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN
          npx vercel build --prod --token=$VERCEL_TOKEN
          npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Deployment Successful"
    }
    failure {
      echo "❌ Deployment Failed"
    }
  }
}