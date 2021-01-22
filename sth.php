function skrypt2(){
  $conn = mysqli_connect("localhost", "root", "", "egzamin3");
  if(!$conn){
    echo "Nie udało się połączyć z bazą";
    return;
  }
  else{
    $query2 = "SELECT id, dataWyjazdu, cel, cena FROM wycieczki WHERE dostepna = 1";
    $res2 = mysqli_query($conn, $query2);
    $row2 = mysqli_fetch_object($res2);

    while ($obj = $row2) {
      printf("%s (%s)\n", $obj->dataWyjazdu, $obj->cel, $obj->cena);
    }

    while($row = mysqli_fetch_array($res2)) {
      echo $row["dataWyjazdu"]." ".$row["cel"]." ".$row["cena"]."<br>";
    }



    //print_r($res2);

    // echo $row2[0].". ".$row2[1].", ".$row2[2]." ,cena: ".$row2[3];
    // funkcja print_r($res2); jest bardzo przydatna, wypisuje nam tablicę z indeksami
  }
}
