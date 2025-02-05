target "server" {
  cache-to = [
    "type=gha,ignore-error=true,mode=max,scope=server"
  ]
  cache-from = [
    "type=gha,scope=server"
  ]
}
target "frontend" {
  cache-to = [
    "type=gha,ignore-error=true,mode=max,scope=frontend"
  ]
  cache-from = [
    "type=gha,scope=frontend"
  ]
}
target "testrunner" {
  cache-to = [
    "type=gha,ignore-error=true,mode=max,scope=testrunner"
  ]
  cache-from = [
    "type=gha,scope=testrunner"
  ]
}
target "db" {
  cache-to = [
    "type=gha,ignore-error=true,mode=max,scope=db"
  ]
  cache-from = [
    "type=gha,scope=db"
  ]
}