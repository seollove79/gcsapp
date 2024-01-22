self.addEventListener('message', function(e) {
    // 메인 스레드로부터 메시지 받기
    var data = e.data;

    

    // 어떤 작업 수행 (예: 데이터 처리)
    var result = data * 2; // 간단한 예시: 입력된 데이터에 2를 곱함

    // 결과를 메인 스레드로 전송
    self.postMessage(result);
});