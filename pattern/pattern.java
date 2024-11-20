public class pattern{
    public static void main(String[] args) {
        int n=5;
        for(int i=0;i<n;i++){
            char c='A';
            for(int j=0;j<i;j++){
                System.out.print(" ");
            }
            for(int j=0;j<n-i;j++){
                System.out.print(c);
                c++;
            }
            System.out.println();
        }
    }
}